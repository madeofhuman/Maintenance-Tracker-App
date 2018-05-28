import { Client } from 'pg';

const config = process.env.DATABASE_URL;

const client = new Client({ config });
client.connect();

export const db = {
  query: (text, params, callback) => client.query(text, params, callback),
};
