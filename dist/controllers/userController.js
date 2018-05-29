'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import dotenv from 'dotenv';


var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _validators = require('../helpers/validators');

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// dotenv.config();

var secretKey = process.env.JWT_KEY;

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: 'createUser',
    value: function createUser(req, res) {
      var _req$body = req.body,
          firstName = _req$body.firstName,
          lastName = _req$body.lastName,
          email = _req$body.email,
          password = _req$body.password;


      var validationResult = (0, _validators.validateUser)(req.body);

      if (validationResult === 'firstNameError') {
        return res.status(400).json({
          error: 'Please enter your first name'
        });
      }

      if (validationResult === 'lastNameError') {
        return res.status(400).json({
          error: 'Please enter your last name'
        });
      }

      if (validationResult === 'emailError') {
        return res.status(400).json({
          error: 'Please enter a valid email'
        });
      }

      if (validationResult === 'passwordError') {
        return res.status(400).json({
          error: 'Please enter a password'
        });
      }

      if (validationResult === 'passwordLengthError') {
        return res.send({ error: 'Please enter a longer password' });
      }

      var passwordHash = _bcrypt2.default.hashSync(password, 10);

      var user = new _user2.default(firstName, lastName, email, passwordHash);

      _database.db.query('INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user.firstName, user.lastName, user.email, user.role, user.password, 'NOW()'], function (error, result) {
        if (error) {
          // console.log('abc ', error);
          return res.status(400).json({ message: error.detail });
        }

        if (result.rowCount < 1) {
          res.status(500).json({
            message: 'The user account was unable to be created, please try again later'
          });
        }

        res.status(201).json({ message: 'The user has been created successfully', result: result.rows[0] });
      });
    }
  }, {
    key: 'userLogin',
    value: function userLogin(req, res) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;


      _database.db.query('SELECT * FROM users WHERE email = $1', [email], function (queryError, queryResult) {
        if (queryError) {
          res.status(500).json({
            error: 'Your request cannot be completed at the moment, please try again later'
          });
          return queryError;
        }

        if (queryResult.rowCount < 1) {
          return res.status(400).json({
            message: 'There is no user with the given email, please check your entry'
          });
        }

        _bcrypt2.default.compare(password, queryResult.rows[0].password_hash, function (bcryptError, bcryptResult) {
          if (bcryptResult) {
            _jsonwebtoken2.default.sign(queryResult.rows[0], secretKey, { expiresIn: '1800s' }, function (jwtError, token) {
              res.set('Content-Type', 'application/json');
              console.log('genToken:', token);
              res.status(302).json({ message: 'You\'ve been successfully logged in', token: token });
            });
          } else {
            return res.status(400).json({ message: 'You entered an incorrect password, please review' });
          }
        });
      });
    }
  }, {
    key: 'userLogout',
    value: function userLogout(req, res, next) {
      res.headers.token = '';
      res.token = '';
      res.status(200).redirect('/api/v1');
      next();
    }
  }]);

  return UserController;
}();

exports.default = UserController;