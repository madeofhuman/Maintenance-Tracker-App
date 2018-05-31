import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import { db } from '../../database';

import app from '../../index';

chai.use(chaiHttp);

const userToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJlbW1hbnVlbCIsImxhc3ROYW1lIjoibmR1a2EiLCJlbWFpbCI6ImVtbWFudWVsbmR1a2FAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Mjc3OTAzNjcsImV4cCI6MTUyNzg3Njc2N30.WekMpBEgxYNNGWhh3JrdD5iRa8omBoQLgiliDF3W_uo';

describe('User registeration', () => {
  const validUser = {
    firstName: 'Emmanuel',
    lastName: 'Nduka',
    email: 'emmanuelnduka@gmail.com',
    password: '123456789',
  };
  const invalidUser = {
    firstName: 'Emmanuel',
    lastName: 'Nduka',
  };
  before((done) => {
    db.query('TRUNCATE TABLE users CASCADE');
    done();
  });

  describe('With valid credentials', () => {
    it('should successfully register the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send(validUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object').with.property('message').equals('Yay! Your account was successfully created.');
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
            res.body.should.be.an('object').with.property('message').equals(`The email ${validUser.email} already exists. If you're the owner, please log in.`);
            done();
          });
      });
    });
  });

  describe('With invalid Credentials', () => {
    it('should not register the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object').with.property('error').equal('Please enter a valid email');
          done();
        });
    });
  });
});

describe('User login', () => {
  const validUser = {
    firstName: 'Emmanuel',
    lastName: 'Nduka',
    email: 'emmanuelnduka@gmail.com',
    role: 'user',
    password: bcrypt.hashSync('1123581321', 10),
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
    db.query('TRUNCATE TABLE users CASCADE');
    db.query(
      'INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [validUser.firstName, validUser.lastName, validUser.email, validUser.role, validUser.password, 'NOW()'],
    );
    done();
  });

  describe('With valid credentials', () => {
    it('should successfully login the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(validAuth)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object').with.property('message').equals('You\'ve been successfully logged in. Go forth and do all the things!');
          done();
        });
    });
  });

  describe('With invalid password', () => {
    it('should not login the user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .set('content-type', 'application/json')
        .send(invalidAuth)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object').with.property('message').equals('Oops! The password you entered isn\'t correct. Please review and try again.');
          done();
        });
    });
  });
});

describe('Request creation', () => {
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
  describe('When an authenticated user', () => {
    describe('creates a valid request', () => {
      it('should successfully create the request', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object').with.property('message').equals('Yay! Your request was successfuly created and is pending admin approval.');
            done();
          });
      });
    });

    describe('creates an invalid request', () => {
      it('should not create the request', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(invalidRequest)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('error').equals('You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'');
            done();
          });
      });
    });
  });

  describe('When an unauthenticated user', () => {
    describe('creates a valid request', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .post('/api/v1/users/requests')
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error').equals('For security reasons, you have been logged out of the application. Please log in to continue using the app.');
            done();
          });
      });
    });
  });
});

describe('Request update', () => {
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
  describe('When an authenticated user', () => {
    describe('creates a valid request update', () => {
      it('should successfully update the request', (done) => {
        chai.request(app)
          .put(`/api/v1/users/requests/${1}`)
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object').with.property('message').equals('You have successfully updated the request');
            done();
          });
      });
    });

    describe('creates an invalid request', () => {
      it('should not update the request', (done) => {
        chai.request(app)
          .put(`/api/v1/users/requests/${1}`)
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(invalidRequest)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('error').equals('You supplied an invalid request type. A request can only be \'maintenance\' or \'repair\'');
            done();
          });
      });
    });
  });

  describe('When an unauthenticated user', () => {
    describe('creates a valid request update', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .put(`/api/v1/users/requests/${1}`)
          .set('content-type', 'application/json')
          .set('Authorization', 'oausnaksn')
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.an('object').with.property('error').equals('For security reasons, you have been logged out of the application. Please log in to continue using the app.');
            done();
          });
      });
    });
  });
});

describe('Request retrieval', () => {
  describe('When an authenticated user gets all their requests', () => {
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

  describe('When an authenticated user gets a request', () => {
    it('should return the specified request', (done) => {
      chai.request(app)
        .get(`/api/v1/users/requests/${2}`)
        .set('content-type', 'application/json')
        .set('Authorization', `${userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

