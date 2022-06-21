import { Router } from 'express';

import { login as loginUser } from '../services/auth.service';
import { validationMiddleware } from '../middleware/validation.middleware';
import { userSchemaRequired } from '../schemas/user';
import { addUser } from '../services/users.service';

const router = Router();

router.post('/register', validationMiddleware(userSchemaRequired), async (req, res) => {
  const newUser = await addUser(req.body);

  res.json({ message: 'User created successfully', data: newUser });
});

router.post('/login', async (req, res) => {
  const {
    login,
    password,
  } = req.body;

  const token = await loginUser(login, password);

  res.json({ jwt_token: token });
});

export default router;
