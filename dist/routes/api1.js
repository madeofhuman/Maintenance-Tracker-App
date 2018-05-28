'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _requestController = require('../controllers/requestController');

var _requestController2 = _interopRequireDefault(_requestController);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api1 = _express2.default.Router();

api1.use(_bodyParser2.default.json());

api1.all('/', function (req, res) {
  res.status(200).send({ message: 'Maintenance Tracker Api V1. Please use /users/requests as a user, or /requests as an admin' });
});

api1.get('/users/requests', _requestController2.default.getRequests);
api1.put('/users/requests/:requestId', _requestController2.default.updateRequest);
api1.post('/users/requests', _requestController2.default.createRequest);
api1.get('/users/requests/:requestId', _requestController2.default.getRequest);
api1.delete('/users/requests/:requestId', _requestController2.default.deleteRequest);
api1.post('/auth/signup', _userController2.default.createUser);
api1.post('/auth/login', _userController2.default.userLogin);
api1.get('/requests', _requestController2.default.getAllRequests);
api1.put('/requests/:requestId/approve', _requestController2.default.approveRequest);
api1.put('/requests/:requestId/disapprove', _requestController2.default.disapproveRequest);
api1.put('/requests/:requestId/resolve', _requestController2.default.resolveRequest);

exports.default = api1;