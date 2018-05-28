'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require('./routes/api1');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var app = (0, _express2.default)();

var port = process.env.PORT || 3000;

app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.status(200).json({ message: 'Maintenance Tracker API' });
});

app.use('/api/v1', _api2.default);

app.all('/api/v2*', function (req, res) {
  res.status(501).json({ message: 'We are working on creating a better experience for you' });
});

app.all('*', function (req, res) {
  res.status(404).json({ error: 'The resource you\'re looking for is not available' });
});

app.listen(port, function () {
  console.log('Running on port ' + port);
});

exports.default = app;