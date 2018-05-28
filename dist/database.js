'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _pg = require('pg');

var config = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/maintain-r';

var client = new _pg.Client({ config: config });
client.connect();

var db = exports.db = {
  query: function query(text, params, callback) {
    return client.query(text, params, callback);
  }
};