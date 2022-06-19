import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';

dotenv.config();

export const sequelize = new Sequelize(`postgres://postgres:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.fatal('Unable to connect to the database:', error);
  }
})();
