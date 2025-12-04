import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import { env } from './config/env';
import { logger } from './config/logger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import prisma from './config/database';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : '*' }));
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1', routes);

app.use(errorHandler);

const server = app.listen(env.PORT, async () => {
  try {
    await prisma.$connect();
    logger.info(`Connected to DB`);
  } catch (err) {
    logger.error('DB connection failed', err);
    process.exit(1);
  }

  logger.info(`Server running on port ${env.PORT}`);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
