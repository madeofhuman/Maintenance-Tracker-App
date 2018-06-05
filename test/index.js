import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import app from '../server/index';

chai.use(chaiHttp);

describe('GET request to API home route', () => {
  it('should return a welcome message', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object').with.property('message')
          .equals('Maintenance Tracker Api V1. Please use /auth/signup tp create an account, ' +
          '/auth/login to log in, /users/requests/ as a user, or /requests/ as an admin.');
        done();
      });
  });
});

describe('GET request to an invalid route', () => {
  it('should return 404 error', (done) => {
    chai.request(app)
      .get('/oio')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object').with.property('error');
        done();
      });
  });
});

describe('GET request to an unimplemented route', () => {
  it('should return 501 status', (done) => {
    chai.request(app)
      .get('/api/v2')
      .end((err, res) => {
        res.should.have.status(501);
        done();
      });
  });
});
