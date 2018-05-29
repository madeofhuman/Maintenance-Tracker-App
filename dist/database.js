'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _pg = require('pg');

var config = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/maintain-r';

var pool = new _pg.Pool(config);

var db = exports.db = {
  query: function query(text, params, callback) {
    return pool.query(text, params, callback);
  }
};