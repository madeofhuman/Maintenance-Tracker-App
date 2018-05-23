'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validateRequest = exports.validateRequest = function validateRequestBody(request) {
  var type = request.type,
      item = request.item,
      model = request.model,
      detail = request.detail;


  if (type === undefined || type.toLowerCase() !== 'repair' && type.toLowerCase() !== 'maintenance') {
    return 'typeError';
  }

  if (item === undefined || item.length < 3) {
    return 'itemError';
  }

  if (type === undefined || type.toLowerCase() === 'repair') {
    if (detail == null || detail.length < 10) {
      return 'detailError';
    }
  }

  if (model === undefined || model.length < 3) {
    return 'modelError';
  }

  return true;
};

var validateUser = exports.validateUser = function validateUserBody() {
  //
};