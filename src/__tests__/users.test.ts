import supertest from 'supertest';
import { NextFunction, Request, Response } from 'express';
import createServer from '../utils/server';
import * as UserService from '../services/users.service';
import { UserInt } from '../models/user';

jest.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
}));

const app = createServer();

const users: UserInt[] = [
  {
    isDeleted: false,
    password: 'pass',
    login: 'login',
    age: 10,
    id: '2',
  },
];

describe('user endpoints', () => {
  describe('get all users', () => {
    it('should return users payload', async () => {
      const getUsersMock = jest
        .spyOn(UserService, 'getUsers')
        .mockReturnValueOnce(users as any);

      const { statusCode, body } = await supertest(app)
        .get('/api/users');

      expect(statusCode).toBe(200);
      expect(body).toEqual({ data: users });
      expect(getUsersMock).toHaveBeenCalled();
    });
  });
  describe('get suggested users', () => {
    it('should return users payload', async () => {
      const limit = 5;
      const getSuggestedUsersMock = jest
        .spyOn(UserService, 'getSuggestedUsers')
      // @ts-ignore
        .mockImplementationOnce(() => users);
      const { statusCode, body } = await supertest(app).get(`/api/users/auto-suggest?limit=${limit}`);

      expect(statusCode).toBe(200);
      expect(getSuggestedUsersMock).toHaveBeenNthCalledWith(1, '', limit);
      expect(body).toEqual({ data: users, limit, loginSubstring: '' });
    });
  });
  describe('get user by id', () => {
    it('should return one user payload', async () => {
      const id = 1;
      const getUserMock = jest
        .spyOn(UserService, 'getUser')
        .mockReturnValueOnce(users[0] as any);
      const { statusCode, body } = await supertest(app).get(`/api/users/${id}`);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        data: users[0],
      });
      expect(getUserMock).toHaveBeenCalledWith(String(id));
    });
  });
  describe('update user by id', () => {
    const id = 1;
    const payload = { login: 'newLogin' };

    it('should return one user payload', async () => {
      const updateUserMock = jest
        .spyOn(UserService, 'updateUser')
        .mockReturnValueOnce(users[0] as any);
      const { statusCode, body } = await supertest(app).put(`/api/users/${id}`).send(payload);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        data: users[0],
      });
      expect(updateUserMock).toHaveBeenCalledWith(String(id), payload);
    });
    it('should fall when payload is not valid', async () => {
      const { statusCode, body } = await supertest(app).put(`/api/users/${id}`).send({ someProp: 'someProp' });

      expect(statusCode).toBe(500);
      expect(body).toHaveProperty('message');
    });
  });
  describe('delete user by id', () => {
    const id = 1;
    it('should delete user', async () => {
      const deleteUserMock = jest
        .spyOn(UserService, 'deleteUser')
        .mockReturnValueOnce(id as any);
      const { statusCode, body } = await supertest(app).delete(`/api/users/${id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('message');
      expect(deleteUserMock).toHaveBeenCalledWith(String(id));
    });
    it('should return 404 when user not found', async () => {
      jest
        .spyOn(UserService, 'deleteUser')
        .mockReturnValueOnce(null as any);
      const { statusCode, body } = await supertest(app).delete(`/api/users/${id}`);

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty('message');
    });
  });
});
