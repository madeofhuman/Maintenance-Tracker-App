import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { db } from '../../server/database';

import app from '../../server/index';

dotenv.config();

chai.use(chaiHttp);

const userToken = process.env.USER_TOKEN;

describe('User Account Actions', () => {
  const validUser = {
    firstName: 'Emmanuel',
    lastName: 'Nduka',
    email: 'emmanuelnduka@gmail.com',
    password: '1123581321',
  };
  const invalidUser = {
    firstName: 'Emmanuel',
    lastName: 'Nduka',
  };
  const validAuth = {
    email: 'emmanuelnduka@gmail.com',
    password: '1123581321',
  };
  const invalidAuth = {
    email: 'emmanuelnduka@gmail.com',
    password: 'password',
  };
  before((done) => {
    db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    done();
  });

  describe('Registeration with valid credentials', () => {
    it('should successfully register the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send(validUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object').with.property('message')
            .equals('Your account was successfully created.');
          done();
        });
    });

    describe('When email already exists in the database', () => {
      it('should not register the user', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .set('content-type', 'application/json')
          .send(validUser)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.an('object').with.property('error').equals('Email conflict');
            done();
          });
      });
    });
  });

  describe('Registeration with invalid credentials', () => {
    it('should not register the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object').with.property('error').equal('Bad Request');
          done();
        });
    });
  });

  describe('Login with valid credentials', () => {
    it('should successfully login the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(validAuth)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object').with.property('token');
          done();
        });
    });
  });

  describe('Login with invalid credentials', () => {
    it('should not login the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(invalidAuth)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.an('object').with.property('error').equals('Forbidden');
          done();
        });
    });
  });
});

describe('Request Actions', () => {
  const validRequest = {
    type: 'repair',
    item: 'Fish',
    model: 'Ice',
    detail: 'It smells rotten',
  };
  const invalidRequest = {
    type: 'repa',
    item: 'Fish',
    model: 'Ice',
    detail: 'It smells rotten',
  };
  const validUpdate = {
    type: 'repair',
    item: 'Lenovo Phone',
    model: 'M8',
    detail: 'It has a notch',
  };
  const invalidUpdate = {
    type: 'maintenances',
    item: 'Lenovo Phone',
    model: 'M8',
    detail: 'It has a notch',
  };
  before((done) => {
    db.query('TRUNCATE TABLE requests RESTART IDENTITY CASCADE');
    done();
  });
  describe('Valid Request Creation', () => {
    describe('By an authenticated user', () => {
      it('should successfully create the request', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object').with.property('message')
              .equals('Your request was successfuly created and is pending admin approval.');
            done();
          });
      });
    });

    describe('By an unauthenticated user', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });

  describe('Invalid request creation', () => {
    describe('By an authenticated user', () => {
      it('should not create the request', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(invalidRequest)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('error').equals('Bad Request');
            done();
          });
      });
    });
  });

  describe('Valid Request Update', () => {
    describe('By an authenticated user', () => {
      it('should successfully update the request', (done) => {
        chai.request(app)
          .put('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', userToken)
          .send(validUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object').with.property('message')
              .equals('You have successfully updated the request');
            done();
          });
      });
    });

    describe('By an unauthenticated user', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .put('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .send(validUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });

  describe('Invalid Request Update', () => {
    describe('By an authenticated user', () => {
      it('should not update the request', (done) => {
        chai.request(app)
          .put('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(invalidUpdate)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('error')
              .equals('Bad Request');
            done();
          });
      });
    });
  });

  describe('Requests Retrieval', () => {
    describe('By an authenticated user', () => {
      it('should return all their requests', (done) => {
        chai.request(app)
          .get('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('By an unauthenticated user', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .get('/api/v1/users/requests/')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });

  describe('Valid Request Retrieval', () => {
    describe('By an authenticated user', () => {
      it('should return the specified request', (done) => {
        chai.request(app)
          .get('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('By an unauthenticated user', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .get('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });

  describe('Invalid Request Retrieval', () => {
    describe('By an authenticated user', () => {
      it('should ask the user to enter valid request id', (done) => {
        chai.request(app)
          .get('/api/v1/users/requests/q')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });

  describe('Valid Request Deletion', () => {
    describe('By an authenticated user', () => {
      it('should succesfully delete the request', (done) => {
        chai.request(app)
          .delete('/api/v1/users/requests/1')
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object').with.property('message').equals('The request was succesfully deleted');
            done();
          });
      });
    });

    describe('By an unauthenticated user', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .delete('/api/v1/users/requests/1')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });

  describe('Invalid Request Deletion', () => {
    describe('By an authenticated user', () => {
      it('should ask the user to supply a valid request id', (done) => {
        chai.request(app)
          .delete('/api/v1/users/requests/q')
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('message')
              .equals('You entered an invalid request id. ' +
                'A request id can only be a positive integer.');
            done();
          });
      });
    });
  });
});

describe('Admin Operations', () => {
  describe('When a non-admin user tries to access admin endpoints', () => {
    it('should return an unauthorized message', (done) => {
      chai.request(app)
        .get('/api/v1/requests')
        .set('Authorization', userToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object').with.property('message')
            .equals('Are you trying to go where you should not? ' +
            'You need admin access to see what goes on here.');
          done();
        });
    });
  });
});
