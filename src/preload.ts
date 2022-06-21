import * as dotenv from 'dotenv';

dotenv.config();

const { env } = process;

export const { PORT } = env;
export const { LOG_LEVEL } = env;
export const { DB_PORT } = env;
export const { DB_PASSWORD } = env;
export const { DB_NAME } = env;
export const { JWT_SECRET } = env;
