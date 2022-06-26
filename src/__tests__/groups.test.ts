import supertest from 'supertest';
import { NextFunction, Request, Response } from 'express';
import { GroupInt, Permissions } from '../models/group';
import * as GroupService from '../services/groups.service';
import createServer from '../utils/server';

jest.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
}));

const app = createServer();

const groupsPayload: GroupInt[] = [{
  name: 'group',
  permissions: [Permissions.delete, Permissions.read],
} as any];

describe('group endpoints', () => {
  describe('get all groups', () => {
    it('should return groups payload', async () => {
      jest.spyOn(GroupService, 'getGroups').mockReturnValueOnce(groupsPayload as any);

      const { statusCode, body } = await supertest(app)
        .get('/api/groups');

      expect(statusCode).toBe(200);
      expect(body).toEqual({ data: groupsPayload });
    });
  });
  describe('get group by id', () => {
    it('should return group id', async () => {
      const id = '123';

      const getGroupMock = jest.spyOn(GroupService, 'getGroup').mockReturnValueOnce(groupsPayload[0] as any);

      const { statusCode, body } = await supertest(app)
        .get(`/api/groups/${id}`);

      expect(statusCode).toBe(200);
      expect(body).toEqual({ data: groupsPayload[0] });
      expect(getGroupMock).toHaveBeenNthCalledWith(1, id);
    });
  });
  describe('create group', () => {
    it('should return new group payload', async () => {
      const addGroupMock = jest.spyOn(GroupService, 'addGroup').mockReturnValueOnce(groupsPayload[0] as any);
      const { statusCode, body } = await supertest(app)
        .post('/api/groups').send(groupsPayload[0]);

      expect(statusCode).toBe(200);
      expect(body?.data).toEqual(groupsPayload[0]);
      expect(addGroupMock).toHaveBeenNthCalledWith(1, groupsPayload[0]);
    });
    it('should fall when payload is not valid', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/groups').send({ name: 'name' });

      expect(statusCode).toBe(500);
      expect(body).toHaveProperty('message');
    });
  });
  describe('update group by id', () => {
    const id = '123';
    const payload = { name: 'name' };
    it('should return updated group payload', async () => {
      const addGroupMock = jest.spyOn(GroupService, 'updateGroup').mockReturnValueOnce(groupsPayload[0] as any);
      const { statusCode, body } = await supertest(app)
        .put(`/api/groups/${id}`).send(payload);

      expect(statusCode).toBe(200);
      expect(body).toEqual({ data: groupsPayload[0] });
      expect(addGroupMock).toHaveBeenNthCalledWith(1, id, payload);
    });
    it('should fall when payload is not valid', async () => {
      const { statusCode, body } = await supertest(app)
        .put(`/api/groups/${id}`).send({ notValid: '' });

      expect(statusCode).toBe(500);
      expect(body).toHaveProperty('message');
    });
  });
  describe('delete group by id', () => {
    const id = '123';
    it('should delete group successfully', async () => {
      const deleteGroupMock = jest.spyOn(GroupService, 'deleteGroup').mockReturnValueOnce(1 as any);
      const { statusCode, body } = await supertest(app)
        .delete(`/api/groups/${id}`);

      expect(body).toHaveProperty('message');
      expect(statusCode).toBe(200);
      expect(deleteGroupMock).toHaveBeenNthCalledWith(1, id);
    });
    it('should fall when no user was deleted', async () => {
      const deleteGroupMock = jest.spyOn(GroupService, 'deleteGroup').mockReturnValueOnce(0 as any);
      const { statusCode, body } = await supertest(app)
        .delete(`/api/groups/${id}`);

      expect(body).toHaveProperty('message');
      expect(statusCode).toBe(404);
      expect(deleteGroupMock).toHaveBeenNthCalledWith(1, id);
    });
  });
  describe('add user to group', () => {
    it('should return 200 status', async () => {
      const payload = {
        groupId: '123',
        userIds: ['123', '122', '121'],
      };
      const addUsersToGroupMock = jest.spyOn(GroupService, 'addUsersToGroup').mockReturnValueOnce({ result: {} } as any);
      const { statusCode, body } = await supertest(app)
        .post('/api/groups/addUsersToGroup').send(payload);

      expect(statusCode).toBe(200);
      expect(body.message).toMatch(/were added/i);
      expect(addUsersToGroupMock).toHaveBeenNthCalledWith(1, payload.groupId, payload.userIds);
    });
    it('should fall when payload not valid', async () => {
      const payload = {
        groupId: '123',
      };
      const { statusCode, body } = await supertest(app)
        .post('/api/groups/addUsersToGroup').send(payload);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/groupId and userIds/i);
    });
    it('should fall when db returns error', async () => {
      const payload = {
        groupId: '123',
        userIds: ['123', '122', '121'],
      };
      const addUsersToGroupMock = jest.spyOn(GroupService, 'addUsersToGroup').mockReturnValueOnce({ error: {} } as any);
      const { statusCode, body } = await supertest(app)
        .post('/api/groups/addUsersToGroup').send(payload);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/exist/i);
      expect(addUsersToGroupMock).toHaveBeenNthCalledWith(1, payload.groupId, payload.userIds);
    });
  });
});
