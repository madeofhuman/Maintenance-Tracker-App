'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _request = require('../models/request');

var _request2 = _interopRequireDefault(_request);

var _validators = require('../helpers/validators');

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var RequestController = function () {
  function RequestController() {
    _classCallCheck(this, RequestController);
  }

  _createClass(RequestController, null, [{
    key: 'getRequests',
    value: function getRequests(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }

      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);

      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      _database.db.query('SELECT * FROM requests WHERE owner = $1', [tokenValidationResult.email], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ error: 'You have no requests' });
        }

        return res.status(200).json(result.rows);
      });
    }
  }, {
    key: 'createRequest',
    value: function createRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var _req$body = req.body,
          type = _req$body.type,
          item = _req$body.item,
          model = _req$body.model,
          detail = _req$body.detail;

      var bodyValidationResult = (0, _validators.validateRequest)(req.body);
      if (bodyValidationResult !== true) {
        res.status(bodyValidationResult.errorCode).json(bodyValidationResult);
      }

      var status = 'pending';
      var owner = tokenValidationResult.email;
      var request = new _request2.default(type, item, model, detail, status, owner);

      _database.db.query('INSERT INTO requests (type, item, model, detail, status, owner, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [request.type, request.item, request.model, request.detail, request.status, request.owner, 'NOW()'], function (error, result) {
        if (error) {
          res.json(error);
          return next(error);
        }

        if (result.rowCount < 1) {
          res.status(500).json({ message: 'Your request was unable to be created at the moment, please try again later' });
        }

        res.status(201).json({ message: 'Your request with id ' + result.rows[0].id + ' was successfuly created and is pending admin approval.' });
      });
    }
  }, {
    key: 'getRequest',
    value: function getRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }

      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);

      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var requestId = parseInt(req.params.requestId, 10);

      if (typeof requestId !== 'number') {
        return res.status(400).json({ error: 'You have entered an invalid request id' });
      }

      _database.db.query('SELECT * FROM requests WHERE owner = $1 AND id = $2', [tokenValidationResult.email, requestId], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ message: 'There is no request with that id' });
        }

        return res.status(200).json(result.rows);
      });
    }
  }, {
    key: 'deleteRequest',
    value: function deleteRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }

      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);

      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var requestId = parseInt(req.params.requestId, 10);

      if (typeof requestId !== 'number') {
        return res.status(400).json({ message: 'You have entered an invalid request id. A valid request id is a positive integer.' });
      }

      _database.db.query('DELETE FROM requests WHERE id = $1 AND owner = $2 RETURNING *', [requestId, tokenValidationResult.email], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rowCount < 1) {
          return res.status(404).json({ message: 'No request with id ' + req.params.requestId + ' was found in the database' });
        }

        res.status(200).json({ message: 'The request was succesfully deleted' });
      });
    }
  }, {
    key: 'updateRequest',
    value: function updateRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var requestId = parseInt(req.params.requestId, 10);

      if (typeof requestId !== 'number') {
        return res.status(400).json({ error: 'You have entered an invalid request id' });
      }

      var bodyValidationResult = (0, _validators.validateRequest)(req.body);
      if (bodyValidationResult !== true) {
        res.status(bodyValidationResult.errorCode).json(bodyValidationResult);
      }

      _database.db.query('UPDATE requests SET type = $1, item = $2, model = $3, detail = $4, updated_at = $5 WHERE id = $6 and owner = $7 and status NOT LIKE $8', [req.body.type, req.body.item, req.body.model, req.body.detail, 'NOW()', req.params.requestId, tokenValidationResult.email, 'pending'], function (error, result) {
        if (error) {
          console.log(error);
          return next(error);
        }

        if (result.rowCount < 1) {
          return res.status(500).json({ message: 'No unapproved request with id ' + req.params.requestId + ' was found in the database' });
        }

        res.status(200).json({ message: 'You have successfully updated the request' });
      });
    }
  }, {
    key: 'getAllRequests',
    value: function getAllRequests(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var adminValidationResult = _validators.tokenValidator.validateAdmin(tokenValidationResult);
      if (adminValidationResult !== true) {
        return res.status(adminValidationResult.errorCode).json(adminValidationResult);
      }

      console.log(adminValidationResult);

      _database.db.query('SELECT * FROM requests ORDER BY id ASC', function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ error: 'There are no requests in the system' });
        }

        return res.status(200).json(result.rows);
      });
    }
  }, {
    key: 'approveRequest',
    value: function approveRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var adminValidationResult = _validators.tokenValidator.validateAdmin(tokenValidationResult);
      if (adminValidationResult !== true) {
        return res.status(adminValidationResult.errorCode).json(adminValidationResult);
      }

      _database.db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['pending', req.params.requestId], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ message: 'There is no request with id ' + req.params.requestId + ' in the system' });
        }

        return res.status(200).json({ message: 'Request ' + req.params.requestId + ' successfully approved' });
      });
    }
  }, {
    key: 'disapproveRequest',
    value: function disapproveRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var adminValidationResult = _validators.tokenValidator.validateAdmin(tokenValidationResult);
      if (adminValidationResult !== true) {
        return res.status(adminValidationResult.errorCode).json(adminValidationResult);
      }

      _database.db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['disapproved', req.params.requestId], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ message: 'There is no request with id ' + req.params.requestId + ' in the system' });
        }

        return res.status(200).json({ message: 'Request ' + req.params.requestId + ' successfully disapproved' });
      });
    }
  }, {
    key: 'resolveRequest',
    value: function resolveRequest(req, res, next) {
      if (!req.headers.token || req.headers.token === 'undefined') {
        return res.status(401).json({
          message: 'Please log in to use the app'
        });
      }
      var tokenValidationResult = _validators.tokenValidator.validateToken(req.headers.token);
      if (!Object.prototype.hasOwnProperty.call(tokenValidationResult, 'id')) {
        return res.status(tokenValidationResult.errorCode).json(tokenValidationResult);
      }

      var adminValidationResult = _validators.tokenValidator.validateAdmin(tokenValidationResult);
      if (adminValidationResult !== true) {
        return res.status(adminValidationResult.errorCode).json(adminValidationResult);
      }

      _database.db.query('UPDATE requests SET status = $1 where id = $2 RETURNING *', ['resolved', req.params.requestId], function (error, result) {
        if (error) {
          return next(error);
        }

        if (result.rows < 1) {
          return res.status(404).json({ message: 'There is no request with id ' + req.params.requestId + ' in the system' });
        }

        return res.status(200).json({ message: 'Request ' + req.params.requestId + ' completed successfully' });
      });
    }
  }]);

  return RequestController;
}();

exports.default = RequestController;