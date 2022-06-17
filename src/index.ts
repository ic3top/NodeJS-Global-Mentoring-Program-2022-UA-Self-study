import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { sequelize } from './db';
import { logger } from './utils/logger';
import usersRouter from './controllers/usersController';
import groupsRouter from './controllers/groupsController';
import { Group } from './models/group';
import { User } from './models/user';

sequelize.sync({ force: true }).then(() => {
  logger.info('Drop and re-sync db.');
});

Group.belongsToMany(User, { through: 'UserGroup' });
User.belongsToMany(Group, { through: 'UserGroup' });

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at https://localhost:${port}`);
});
