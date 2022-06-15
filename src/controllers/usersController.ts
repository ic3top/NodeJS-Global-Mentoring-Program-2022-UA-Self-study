import express from 'express';
import {
  addUser, deleteUser, getSuggestedUsers, getUser, getUsers, updateUser,
} from '../services/usersService';
import { userSchemaOptional, userSchemaRequired } from '../schemas/user';

// TODO: Handle errors
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

router.post('/', async (req, res) => {
  const { value, error } = userSchemaRequired.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: 'Invalid data provided', errors: error.details, data: value });
    return;
  }

  const newUser = await addUser(req.body);

  res.json({ message: 'User created successfully', data: newUser });
});

router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const payload = req.body;

  const { value, error } = userSchemaOptional.validate(payload, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: 'Invalid data provided', errors: error.details, data: value });
    return;
  }

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
    res.json({ message: `User with ${userId} id was not found.` });
    return;
  }

  res.json({ message: `User with ${userId} id was deleted.` });
});

export default router;
