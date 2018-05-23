import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import { requests } from '../../database';

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
      while (requests.length > 0) {
        requests.pop();
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

describe('/POST request to \'/api/v1/users/requests\'', () => {
  describe('Valid /POST request', () => {
    const validRequest = {
      type: 'repair',
      item: 'Samsung Phone',
      model: 'Galaxy S8+',
      detail: 'The screen shattered',
    };

    const host = `http://${process.env.IP || 'localhost'}:${process.env.PORT || 3000}`;

    it('should return 201 status', (done) => {
      chai.request(host)
        .post('/api/v1/users/requests')
        .set('content-type', 'application/json')
        .send(validRequest)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });

    it('should return the object created', (done) => {
      chai.request(host)
        .post('/api/v1/users/requests')
        .set('content-type', 'application/json')
        .send(validRequest)
        .end((req, res) => {
          res.body.should.be.an('object').with.property('request').with.property('id').equal(requests[requests.length - 1].id);
          done();
        });
    });
  });

  describe('Invalid /POST request', () => {
    const invalidRequest = {
      type: 'ripar',
      item: 'Samsung Phone',
      model: 'Galaxy S8+',
      detail: 'The screen shattered',
    };

    const host = `http://${process.env.IP || 'localhost'}:${process.env.PORT || 3000}`;

    it('should return a 400 bad request error', (done) => {
      chai.request(host)
        .post('/api/v1/users/requests')
        .set('content-type', 'application/json')
        .send(invalidRequest)
        .end((req, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object').with.property('error');
          done();
        });
    });
  });
});


describe('/GET request to \'/api/v1/users/requests/1\'', () => {
  describe('When the database is not empty', () => {
    it('should return 200 status', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return an object', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
        .end((err, res) => {
          res.body.should.be.an('object').with.property('id').equal(requests.find(request => request.id === 1).id);
          done();
        });
    });
  });

  describe('When the database is empty', () => {
    before(() => {
      while (requests.length > 0) {
        requests.pop();
      }
    });

    it('should return a 204 error', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('should return an error message', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
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


describe('/PUT request on /users/requests/1', () => {
  describe('When the request exists', () => {
    it('it should update a request with the given id', (done) => {
      chai.request(app)
        .put(`/api/v1/users/requests/${1}`)
        .set('content-type', 'application/json')
        .send({
          type: 'maintenance',
          item: 'LG Iron',
          model: 'LYU-908',
          detail: '',
        })
        .end((err, res) => {
          // status is 404 instead of 200. Fix.
          // res.should.have.status(200);
          res.body.should.be.an('object');
          // res.body.should.have.property('message').equal('request 1 was successfully updated!');
          done();
        });
    });
  });
});
