const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || {
  user: 'postgres',
  database: 'maintain-r',
  password: 'postgres',
  port: 5432,
};

const pool = new Pool(connectionString);

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
