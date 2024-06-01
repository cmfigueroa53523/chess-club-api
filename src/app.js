import fastify from 'fastify';

export async function build(opts = {}) {
  const app = fastify(opts);

  await app.register(import('@fastify/rate-limit'), {
    max: 50,
    timeWindow: '1 minute'
  });

  app.register(import('@fastify/postgres'), {
    connectionString: process.env.DB_CONNECTION_URL,
  });

  // JWT secret keys
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  app.register(import('@fastify/jwt'), {
    secret: JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false
    }
  });

  app.register(import('@fastify/cookie'));

  // Authentication decorator
  app.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  app.post('/get-token', (req, reply) => {
    const { username, password } = req.body;

    // TODO: check db values
    if(username === 'test' && password === 'test') {
      const token = app.jwt.sign({ username }, { expiresIn: '7d'});
      const refreshToken = app.jwt.sign({ username }, { secret: JWT_REFRESH_SECRET, expiresIn: '8d' });
      reply.setCookie('refreshToken', refreshToken, { path: '/', httpOnly: true });
      reply.send({ token });
    }

    reply.status(401).send({ error: 'Email or password is incorrect' });

  });

  app.post('/refresh-token', async (request, reply) => {
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      return reply.status(401).send({ error: 'Refresh token not provided' });
    }

    try {
      const decoded = app.jwt.verify(refreshToken, { secret: JWT_REFRESH_SECRET });
      const newToken = app.jwt.sign({ username: decoded.username }, { expiresIn: '8d' });
      return reply.send({ token: newToken });
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  const v1Prefix = '/api/v1';

  app.register(import('./routes/v1/members.js'), { prefix: v1Prefix });
  app.register(import('./routes/v1/clubInfo.js'), { prefix: v1Prefix });

  return app;
}
