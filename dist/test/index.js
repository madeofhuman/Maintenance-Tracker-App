'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

require('chai/register-should');

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);

describe('/GET request to a valid route \'/\'', function () {
  it('should return a welcome message', function (done) {
    _chai2.default.request(_index2.default).get('/').end(function (err, res) {
      res.body.should.be.an('object').with.property('message');
      done();
    });
  });
});

describe('/GET request to an invalid route \'/oio\'', function () {
  it('should return 404 error', function (done) {
    _chai2.default.request(_index2.default).get('/oio').end(function (err, res) {
      res.should.have.status(404);
      done();
    });
  });

  it('should return an error message', function (done) {
    _chai2.default.request(_index2.default).get('/oio').end(function (err, res) {
      res.body.should.be.an('object').with.property('error');
      done();
    });
  });
});

describe('/GET request to an unimplemented route \'/ap1/v2\'', function () {
  it('should return 501 status', function (done) {
    _chai2.default.request(_index2.default).get('/api/v2').end(function (err, res) {
      res.should.have.status(501);
      done();
    });
  });
});