"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function Request(type, item, model, detail, status, owner) {
  _classCallCheck(this, Request);

  this.type = type;
  this.item = item;
  this.model = model;
  this.detail = detail;
  this.status = status;
  this.owner = owner;
};

exports.default = Request;