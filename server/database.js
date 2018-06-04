import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let config;

if (process.env.NODE_ENV === 'test') {
  config = process.env.DATABASE_URL_T;
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev') {
  config = process.env.DATABASE_URL;
}

const client = new Client(config);
client.connect()
  .then(() => console.log('connected to postgres db...'))
  .catch(e => console.error('connection error', e.stack));

export const db = {
  // query: (text, params, callback) => client.query(text, params, callback),
  query: (sql, params) => client.query(sql, params),
};
