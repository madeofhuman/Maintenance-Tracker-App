import { Client } from 'pg';

const config = {
  user: process.env.User,
  database: process.env.Database,
  password: process.env.Password,
  port: process.env.Port,
};

const client = new Client({ config });
client.connect();

export const db = {
  query: (text, params, callback) => client.query(text, params, callback),
};
