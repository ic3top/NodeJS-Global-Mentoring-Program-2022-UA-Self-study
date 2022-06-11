import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { initTable } from './db/setup/initTable';
import { logger } from './utils/logger';

import usersRouter from './controllers/userController';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

initTable();

app.listen(port, () => {
  logger.info(`[server]: Server is running at https://localhost:${port}`);
});
