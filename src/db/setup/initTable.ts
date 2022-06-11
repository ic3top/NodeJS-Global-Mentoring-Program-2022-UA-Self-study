/* eslint-disable no-tabs */
import format from 'pg-format';
import { makeQuery } from '../index';
import { INIT_USERS_DATA } from './initialData';

const clearUsersTable = 'DROP TABLE IF EXISTS "users"';

const createUsersTable = `CREATE TABLE "users" (
        "id" SERIAL,
        "login" VARCHAR(140) NOT NULL,
        "password" VARCHAR NOT NULL,
        "age" NUMERIC,
        "is_deleted" BOOLEAN NOT NULL,
	    PRIMARY KEY ("id")
);`;

const insertUsers = format('INSERT INTO users (login, password, age, is_deleted) VALUES %L', INIT_USERS_DATA);

export const initTable = () => makeQuery(clearUsersTable)
  .then(() => makeQuery(createUsersTable))
  .then(() => makeQuery(insertUsers));
