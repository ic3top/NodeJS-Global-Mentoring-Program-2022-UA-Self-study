import express from 'express';
import log4js from 'log4js';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

import usersRouter from './controllers/userController';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL as string;

app.listen(port, () => {
  logger.info(`[server]: Server is running at https://localhost:${port}`);
});
