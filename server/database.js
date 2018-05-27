import { Pool } from 'pg';

const config = process.env.DATABASE_URL || {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const pool = new Pool({ config });

export const db = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
