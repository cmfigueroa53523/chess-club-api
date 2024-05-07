import fastify from 'fastify';

export async function build(opts = {}) {
  const app = fastify(opts);

  app.register(import('@fastify/postgres'), {
    connectionString: process.env.DB_CONNECTION_URL,
  });

  const v1Prefix = '/api/v1';

  app.register(import('./routes/v1/members.js'), { prefix: v1Prefix });

  return app;
}
