import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { JWT_SECRET } from '../preload';

export const login = async (userLogin: string, password: string) => {
  const user = await User.findOne({
    where: {
      login: userLogin,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({
    id: user.id,
    login: user.login,
  }, JWT_SECRET as string, { expiresIn: '1d' });

  return token;
};
