'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('../models/request');

var _request2 = _interopRequireDefault(_request);

var _validators = require('../helpers/validators');

var _database = require('../database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestController = function () {
  function RequestController() {
    _classCallCheck(this, RequestController);
  }

  _createClass(RequestController, null, [{
    key: 'getRequests',
    value: function getRequests(req, res) {
      if (_database.requests.length < 1) {
        return res.status(404).json({ error: 'You have no requests' });
      }

      return res.status(200).json(_database.requests);
    }
  }, {
    key: 'createRequest',
    value: function createRequest(req, res) {
      var id = _database.requests.length > 0 ? _database.requests[_database.requests.length - 1].id + 1 : _database.requests.length + 1;

      var _req$body = req.body,
          type = _req$body.type,
          item = _req$body.item,
          model = _req$body.model,
          detail = _req$body.detail;


      var validationResult = (0, _validators.validateRequest)(req.body);

      if (validationResult === 'typeError') {
        return res.status(400).send({
          error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\''
        });
      }

      if (validationResult === 'itemError') {
        return res.status(400).send({
          error: 'You supplied an invalid item. An item must be a string of more than three characters.'
        });
      }

      if (validationResult === 'detailError') {
        return res.status(400).send({
          error: 'Please enter a description of the error that is more than ten characters'
        });
      }

      if (validationResult === 'modelError') {
        return res.status(400).send({
          error: 'Please enter a valid model. A valid model is more than 2 characters'
        });
      }

      var request = new _request2.default(id, type, item, model, detail);

      _database.requests.push(request);
      return res.status(201).send({
        request: request,
        location: '/api/v1/users/requests/' + id
      });
    }
  }, {
    key: 'getRequest',
    value: function getRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);

      if (typeof requestId !== 'number') {
        return res.status(400).json({ error: 'You have entered an invalid request id' });
      }

      var result = _database.requests.find(function (request) {
        return request.id === requestId;
      });

      if (result === undefined) {
        return res.status(404).json({ error: 'There is no request with that id' });
      }

      return res.status(200).json(result);
    }
  }, {
    key: 'deleteRequest',
    value: function deleteRequest(req, res) {
      var request = _database.requests.find(function (r) {
        return r.id === parseInt(req.params.requestId, 10);
      });

      if (!request) {
        return res.status(404).json({ error: 'The request with the given id was not found' });
      }

      var index = _database.requests.indexOf(request);
      _database.requests.splice(index, 1);

      return res.status(202).json(request);
    }
  }, {
    key: 'updateRequest',
    value: function updateRequest(req, res) {
      var request = _database.requests.find(function (r) {
        return r.id === parseInt(req.params.requestId, 10);
      });

      if (request === undefined) {
        return res.status(404).json({ error: 'There is no request with that id in the dataase' });
      }

      var validationResult = (0, _validators.validateRequest)(req.body);

      if (validationResult === 'typeError') {
        return res.status(400).json({
          error: 'You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\''
        });
      }

      if (validationResult === 'itemError') {
        return res.status(400).json({
          error: 'You supplied an invalid item. An item must be a string of more than three characters.'
        });
      }

      if (validationResult === 'detailError') {
        return res.status(400).json({
          error: 'Please enter a description of the error that is more than ten characters'
        });
      }

      if (validationResult === 'modelError') {
        return res.status(400).json({
          error: 'Please enter a valid model. A valid model is more than 2 characters'
        });
      }

      request.type = req.body.type;
      request.item = req.body.item;
      request.model = req.body.model;
      request.detail = req.body.detail;
      return res.status(200).json({
        message: 'request ' + request.id + ' was successfully updated!'
      });
    }
  }]);

  return RequestController;
}();

exports.default = RequestController;