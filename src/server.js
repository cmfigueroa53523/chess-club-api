import { build } from './app.js';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';
const logLevel = process.env.LOGGER_LEVEL || 'info';

const opts = {
  logger: {
    level: logLevel,
  }
};

if(process.stdout.isTTY) {
  opts.logger.transport = { target: 'pino-pretty' };
}

const app = await build(opts);

app.listen({ port: port, host: host });
