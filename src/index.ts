import { sequelize } from './db';
import './db/relations';
import { logger } from './utils/logger';
import { PORT } from './preload';
import createServer from './utils/server';

sequelize.sync({ force: true }).then(() => {
  logger.info('Drop and re-sync db.');
});

const app = createServer();

app.listen(PORT, async () => {
  logger.info(`[server]: Server is running at https://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.fatal('Unable to connect to the database:', error);
  }
});

process.on('unhandledRejection', (error: Error) => {
  logger.error('unhandledRejection', error.message);
});
