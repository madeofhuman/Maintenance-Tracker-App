import { Client } from 'pg';

let config;

if (process.env.NODE_ENV === 'test') {
  config = process.env.DATABASE_URL_T;
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev') {
  config = process.env.DATABASE_URL;
}

const client = new Client(config);
client.connect();

export const db = {
  query: (text, params, callback) => client.query(text, params, callback),
};
