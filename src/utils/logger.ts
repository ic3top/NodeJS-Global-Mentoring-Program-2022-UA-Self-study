import log4js from 'log4js';
import * as dotenv from 'dotenv';

dotenv.config();

export const logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL as string;
