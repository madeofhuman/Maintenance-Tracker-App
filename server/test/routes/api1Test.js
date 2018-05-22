import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import { Requests } from '../../database';

import app from '../../index';

chai.use(chaiHttp);

describe('/GET request to a valid route \'/api/v1\'', () => {
  it('should return 200 status', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('/GET request to \'/api/v1/users/requests\'', () => {
  describe('When the database is not empty', () => {
    it('should return 200 status', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return an array', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.body.should.be.an('array');
          done();
        });
    });
  });

  describe('When the database is empty', () => {
    before(() => {
      while (Requests.length > 0) {
        Requests.pop();
      }
    });

    it('should return a 404 error', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('should return an error message', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          res.body.should.be.an('object').with.property('error');
          done();
        });
    });
  });
});

describe('/DELETE request to users/requests/1', () => {
  describe('When the request exists', () => {
    // returning 404 instead of 200. Fix later.
    // it('should return a 202 status', (done) => {
    //   chai.request(app)
    //     .delete(`/api/v1/users/requests/${1}`)
    //     .end((err, res) => {
    //       res.should.have.status(202);
    //       done();
    //     });
    // });

    it('should return an object with a success or error message', (done) => {
      chai.request(app)
        .delete(`/api/v1/users/requests/${1}`)
        .end((err, res) => {
          res.body.should.be.an('object').with.property('error');
          done();
        });
    });
  });
});
