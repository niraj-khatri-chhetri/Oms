import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Logger } from '@nestjs/common';
import * as schema from './schema';

export const DRIZZLE = Symbol('DRIZZLE');

const logger = new Logger('DatabaseModule');

export const databaseProvider = {
  provide: DRIZZLE,
  useFactory: async () => {
    console.log('Dataabse url: ', process.env.DATABASE_URL);

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();
    // Connection test to ensure the database is reachable before initializing Drizzle
    await client.query('SELECT 1');
    client.release();
    logger.log('Database connection established');

    return drizzle(pool, {
      schema,
      logger: process.env.NODE_ENV === 'development',
    });
  },
};

export type DrizzleDB = Awaited<ReturnType<typeof databaseProvider.useFactory>>;
