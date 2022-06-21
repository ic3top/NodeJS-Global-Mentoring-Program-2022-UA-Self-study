import log4js from 'log4js';
import { LOG_LEVEL } from '../preload';

export const logger = log4js.getLogger();

logger.level = LOG_LEVEL as string;
