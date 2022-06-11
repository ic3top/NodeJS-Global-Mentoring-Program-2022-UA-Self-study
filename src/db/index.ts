import { Pool, PoolClient, QueryResult } from 'pg';
import * as dotenv from 'dotenv';
import { User } from '../modals/user';
import { logger } from '../utils/logger';

dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  // @ts-ignore
  port: process.env.DB_PORT,
});

export const makeQuery = (
  text: string,
  params?: any,
) => {
  const start = Date.now();

  return new Promise<[Error, QueryResult<User>]>(((resolve, reject) => {
    pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      logger.info('executed query', { text, duration, ...(res && { rows: res.rowCount }) });

      if (err) {
        logger.error(err.message);
        return reject(err);
      }

      return resolve([err, res]);
    });
  }));
};

export const getClient = async () => {
  const client = await pool.connect() as PoolClient & { lastQuery: any };
  const { query } = client;
  const { release } = client;

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

  // monkey patch the query method to keep track of the last query executed
  // @ts-ignore
  client.query = (...args: any) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);

    client.query = query;
    client.release = release;

    return release.apply(client);
  };

  return client;
};
