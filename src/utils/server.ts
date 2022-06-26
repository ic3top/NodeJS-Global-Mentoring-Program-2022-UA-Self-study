import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import usersRouter from '../controllers/users.controller';
import groupsRouter from '../controllers/groups.controller';
import { errorMiddleware } from '../middleware/error.middleware';

function createServer() {
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

  return app;
}

export default createServer;
