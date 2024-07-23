import {drizzle} from 'drizzle-orm/mysql2';
import {migrate} from 'drizzle-orm/mysql2/migrator';

import * as schema from '@/db/schema';
import mysql from 'mysql2/promise';
const mySqlConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  user: import.meta.env.DB_USERNAME || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME || 'oneform_db',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
};

const sql = mysql.createPool(mySqlConfig);
const db = drizzle(sql, {schema: schema, mode: 'default'});
await migrate(db, {migrationsFolder: 'drizzle'});

export default db;
