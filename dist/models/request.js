"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function Request(id, type, item, model, detail) {
  _classCallCheck(this, Request);

  this.id = id;
  this.type = type;
  this.item = item;
  this.model = model;
  this.detail = detail;
};

exports.default = Request;