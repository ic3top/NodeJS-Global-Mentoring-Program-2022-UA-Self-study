import { faker } from '@faker-js/faker';
import { User } from '../modals/user';
import { generateUsersData } from '../mocks';

let mockData = generateUsersData(10);

export const getUsers = async () => mockData.filter(({ isDeleted }) => !isDeleted);
export const getSuggestedUsers = async (subName: string, limit: number) => {
  const filteredUsers = subName ? mockData.filter(({ login }) => login.includes(subName)) : mockData;
  filteredUsers.sort((a: User, b: User) => a.login.localeCompare(b.login));

  return filteredUsers.slice(0, limit + 1);
};
export const getUser = async (userId: string) => mockData.find(({ id }) => id === userId);

export const deleteUser = async (userId: string) => {
  mockData = mockData.map((user) => {
    if (user.id === userId) return { ...user, isDeleted: true };
    return user;
  });
  return getUser(userId);
};

export const updateUser = async (userId: string, payload: Partial<User>) => {
  mockData = mockData.map((user) => {
    if (user.id === userId) return { ...user, ...payload };
    return user;
  });
  return getUser(userId);
};

export const addUser = async (newUser: User) => {
  mockData.push({ ...newUser, id: faker.database.mongodbObjectId(), isDeleted: false });
  return newUser;
};
