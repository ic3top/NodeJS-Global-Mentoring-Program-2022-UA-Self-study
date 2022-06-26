import { Group } from '../models/group';
import { sequelize } from '../db';

export const getGroups = async () => {
  const groups = await Group.findAll();

  return groups;
};

export const getGroup = async (groupId: string) => {
  const group = await Group.findOne({
    where: {
      id: groupId,
    },
  });

  return group;
};

export const addGroup = async (newGroup: Group) => {
  const createdGroup = await Group.create(newGroup);

  return createdGroup;
};

export const updateGroup = async (groupId: string, payload: Partial<Group>) => {
  const updatedGroup = await Group.update(payload, {
    where: {
      id: groupId,
    },
    returning: true,
  });

  return updatedGroup[1];
};

export const deleteGroup = async (groupId: string) => {
  const deletedGroup = Group.destroy({ where: { id: groupId } });

  return deletedGroup;
};

export const addUsersToGroup = async (groupId: string, userIds: string[]) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const group = await Group.findOne({ where: { id: groupId } });
      // @ts-ignore
      await group.addUsers(userIds);

      return group;
    });

    return { result };
  } catch (error) {
    return { error };
  }
};
