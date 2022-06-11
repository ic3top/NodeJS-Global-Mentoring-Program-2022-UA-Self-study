import format from 'pg-format';
import { makeQuery } from '../db';
import { User } from '../modals/user';

export const getUsers = async () => {
  const [, data] = await makeQuery('SELECT id, login, password, age from users WHERE is_deleted IS NOT TRUE');

  return {
    users: data.rows,
    length: data.rowCount,
  };
};

export const getUser = async (userId: string) => {
  const [, data] = await makeQuery('SELECT * FROM users WHERE id = $1 AND is_deleted IS NOT TRUE', [userId]);

  return data.rows;
};

export const getSuggestedUsers = async (subName: string, limit: number) => {
  const [, data] = await makeQuery(format(
    `SELECT * FROM users 
    WHERE login Ilike %L AND is_deleted IS NOT TRUE
    ORDER BY login DESC 
    LIMIT %L`,
    `%${subName}%`,
    limit,
  ));

  return { length: data.rowCount, data: data.rows };
};

export const deleteUser = async (userId: string) => {
  const [, data] = await makeQuery('UPDATE users SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING id, login, password, age', [userId]);

  return data.rows;
};

export const updateUser = async (userId: string, payload: Partial<User>) => {
  const properties = Object.keys(payload);
  const values = Object.values(payload);

  const queryString = format(
    'UPDATE users SET (%I) = (%L) WHERE id = %s RETURNING id, login, password, age',
    properties,
    values,
    userId,
  );

  const [, data] = await makeQuery(queryString);
  return data.rows;
};

export const addUser = async (newUser: User): Promise<User[]> => {
  const { login, password, age } = newUser;
  const [, data] = await makeQuery(
    `INSERT INTO users (login, password, age, is_deleted)
      VALUES ($1, $2, $3, false)
      RETURNING id, login, password, age`,
    [login, password, age],
  );

  return data.rows;
};
