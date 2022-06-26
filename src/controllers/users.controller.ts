import express from 'express';
import {
  deleteUser, getSuggestedUsers, getUser, getUsers, updateUser,
} from '../services/users.service';
import { userSchemaOptional } from '../schemas/user';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await getUsers();

  res.json({ data: users });
});

router.get('/auto-suggest', async (req, res) => {
  const limit = Number(req.query.limit || 10);
  const loginSubstring = req.query.loginSubstring as string || '';
  const suggestedUsers = await getSuggestedUsers(loginSubstring, limit);

  res.json({ data: suggestedUsers, limit, loginSubstring });
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const user = await getUser(userId);

  if (!user) {
    res.json({ message: `User with ${userId} id was not found.` });
    return;
  }

  res.json({ data: user });
});

router.put('/:id', validationMiddleware(userSchemaOptional), async (req, res) => {
  const userId = req.params.id;
  const payload = req.body;

  const updatedUser = await updateUser(userId, payload);

  if (!updatedUser) {
    res.status(400).json({ message: `User with ${userId} id was not found.` });
    return;
  }

  res.json({ data: updatedUser });
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  const deletedUserId = await deleteUser(userId);

  if (!deletedUserId) {
    res.status(404).json({ message: `User with ${userId} id was not found.` });
    return;
  }

  res.json({ message: `User with ${userId} id was deleted.` });
});

export default router;
