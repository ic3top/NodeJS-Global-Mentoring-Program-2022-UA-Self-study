import { Op } from 'sequelize';
import { hash } from 'bcrypt';
import { User, UserInt } from '../models/user';

export const getUsers = async () => {
  const users = await User.findAll({
    where: {
      isDeleted: false,
    },
  });

  return users;
};

export const getUser = async (userId: string) => {
  const user = await User.findOne({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  return user;
};

export const getSuggestedUsers = async (subName: string, limit: number) => {
  const users = await User.findAll({
    limit,
    where: {
      login: {
        [Op.like]: `%${subName}%`,
      },
      isDeleted: false,
    },
    order: [
      ['login', 'DESC'],
    ],
  });

  return users;
};

export const deleteUser = async (userId: string) => {
  const deletedUserId = await User.update(
    { isDeleted: true },
    { where: { id: userId, isDeleted: false } },
  );

  return deletedUserId;
};

export const updateUser = async (userId: string, payload: Partial<User>) => {
  const updatedUser = await User.update(payload, {
    where: {
      id: userId,
      isDeleted: false,
    },
    returning: true,
  });

  return updatedUser[1];
};

export const addUser = async (newUser: UserInt) => {
  const createdUser = await User.create({
    ...newUser,
    password: await hash(newUser.password, 10),
  });

  return createdUser;
};
