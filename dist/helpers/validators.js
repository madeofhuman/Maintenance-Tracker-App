'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenValidator = exports.validateUser = exports.validateRequest = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var secretKey = process.env.JWT_KEY;

var validateRequest = exports.validateRequest = function validateRequestBody(request) {
  var type = request.type,
      item = request.item,
      model = request.model,
      detail = request.detail;


  var result = void 0;

  if (type === undefined || type.toLowerCase() !== 'repair' && type.toLowerCase() !== 'maintenance') {
    result = {
      errorMessage: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'',
      errorCode: 400
    };
  }

  if (item === undefined || item.length < 3) {
    result = {
      errorMessage: 'You supplied an invalid item. An item must be a string of more than three characters.',
      errorCode: 400
    };
  }

  if (type === undefined || type.toLowerCase() === 'repair') {
    if (detail == null || detail.length < 10) {
      result = {
        errorMessage: 'Please enter a description of the error that is more than ten characters',
        errorCode: 400
      };
    }
  }

  if (model === undefined || model.length < 3) {
    result = {
      errorMessage: 'Please enter a valid model. A valid model is more than 2 characters',
      errorCode: 400
    };
  }

  result = true;

  return result;
};

var validateUser = exports.validateUser = function validateUserBody(user) {
  var firstName = user.firstName,
      lastName = user.lastName,
      email = user.email,
      password = user.password;


  if (firstName === undefined) return 'firstNameError';

  if (lastName === undefined) return 'lastNameError';

  if (email === undefined) return 'emailError';

  if (password === undefined) return 'passwordError';

  if (password.length < 4) return 'passwordLengthError';

  return true;
};

var tokenValidator = exports.tokenValidator = {
  validateToken: function validateToken(accessToken) {
    var result = void 0;

    _jsonwebtoken2.default.verify(accessToken, secretKey, function (jwtError, authData) {
      if (jwtError) {
        result = {
          errorMessage: 'Invalid or expired access token, please log in to access the app',
          errorCode: 400
        };
        return;
      }

      result = authData;
    });

    return result;
  },

  validateAdmin: function validateAdmin(authenticatedUser) {
    var result = void 0;
    if (authenticatedUser.role !== 'admin') {
      result = {
        errorMessage: 'You need admin access to perform this opertion',
        errorCode: 403
      };
    } else {
      result = true;
    }
    return result;
  }
};