import { Pool } from 'pg';

const config = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/maintain-r';

const pool = new Pool(config);

export const db = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
