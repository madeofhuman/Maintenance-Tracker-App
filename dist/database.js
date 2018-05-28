'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _pg = require('pg');

var config = {
  user: process.env.User,
  database: process.env.Database,
  password: process.env.Password,
  port: process.env.Port
};

var client = new _pg.Client({ config: config });
client.connect();

var db = exports.db = {
  query: function query(text, params, callback) {
    return client.query(text, params, callback);
  }
};