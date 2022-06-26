import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { DB_PASSWORD, DB_PORT, DB_NAME } from '../preload';

dotenv.config();

export const sequelize = new Sequelize(`postgres://postgres:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`);
