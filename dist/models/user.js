'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(firstName, lastName, email, password) {
  _classCallCheck(this, User);

  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.role = 'user';
  this.password = password;
};

exports.default = User;