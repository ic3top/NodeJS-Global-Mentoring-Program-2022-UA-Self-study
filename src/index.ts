import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './db';
import './db/relations';
import { logger } from './utils/logger';
import usersRouter from './controllers/users.controller';
import groupsRouter from './controllers/groups.controller';
import { errorMiddleware } from './middleware/arror.middleware';
import authRouter from './controllers/auth.controller';
import { PORT } from './preload';
import { authMiddleware } from './middleware/auth.middleware';

sequelize.sync({ force: true }).then(() => {
  logger.info('Drop and re-sync db.');
});

const port = PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/users', [authMiddleware], usersRouter);
app.use('/api/groups', [authMiddleware], groupsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`[server]: Server is running at https://localhost:${port}`);
});

process.on('unhandledRejection', (error: Error) => {
  logger.error('unhandledRejection', error.message);
});
