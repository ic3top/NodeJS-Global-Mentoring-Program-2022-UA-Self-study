import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';
import { DB_PASSWORD, DB_PORT, DB_NAME } from '../preload';

dotenv.config();

export const sequelize = new Sequelize(`postgres://postgres:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.fatal('Unable to connect to the database:', error);
  }
})();
