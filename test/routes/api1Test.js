import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { db } from '../../server/database';

import app from '../../server/index';

dotenv.config();

chai.use(chaiHttp);

const userToken = process.env.USER_TOKEN;

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
          res.body.should.be.an('object').with.property('message')
            .equals('Yay! Your account was successfully created.');
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

  describe('With invalid Credentials', () => {
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
      'INSERT INTO users (first_name, last_name, email, role, password_hash, created_at) ' +
      'VALUES ($1, $2, $3, $4, $5, $6)',
      [
        validUser.firstName, validUser.lastName, validUser.email,
        validUser.role, validUser.password, 'NOW()',
      ],
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
          res.body.should.be.an('object').with.property('token');
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
          res.should.have.status(403);
          res.body.should.be.an('object').with.property('error').equals('Forbidden');
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
            res.body.should.be.an('object').with.property('message')
              .equals('Yay! Your request was successfuly created and is pending admin approval.');
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
            res.body.should.be.an('object').with.property('error').equals('Bad Request');
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
            res.body.should.be.an('object').with.property('error')
              .equals('Invalid or expired access token');
            done();
          });
      });
    });
  });
});

describe('Request update', () => {
  const validRequest = {
    type: 'maintenance',
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
  let requestId;
  before((done) => {
    db.query('SELECT * FROM requests ORDER BY id DESC')
      .then((result) => {
        const { id } = result.rows[0];
        requestId = parseInt(id, 10);
      })
      .catch(error => console.log(error));
    done();
  });
  describe('When an authenticated user', () => {
    describe('creates a valid request update', () => {
      it('should successfully update the request', (done) => {
        chai.request(app)
          .put('/api/v1/users/requests/' + requestId)
          .set('content-type', 'application/json')
          .set('Authorization', userToken)
          .send(validRequest)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object').with.property('message')
              .equals('You have successfully updated the request');
            done();
          });
      });
    });

    describe('creates an invalid request', () => {
      it('should not update the request', (done) => {
        chai.request(app)
          .put(`/api/v1/users/requests/${2}`)
          .set('content-type', 'application/json')
          .set('Authorization', `${userToken}`)
          .send(invalidRequest)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('error')
              .equals('Bad Request');
            done();
          });
      });
    });
  });

  describe('When an unauthenticated user', () => {
    describe('creates a valid request update', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .put(`/api/v1/users/requests/${2}`)
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

  describe('When an unauthenticated user', () => {
    describe('tries to get a request', () => {
      it('should ask the user to log in first', (done) => {
        chai.request(app)
          .get(`/api/v1/users/requests/${2}`)
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
});

describe('Request Deletion', () => {
  let requestId;
  before((done) => {
    db.query('SELECT * FROM requests ORDER BY id DESC')
      .then((result) => {
        const { id } = result.rows[0];
        requestId = parseInt(id, 10);
      })
      .catch(error => console.log(error));
    done();
  });
  describe('when authenticated user', () => {
    describe('supplies a valid request id', () => {
      it('should succesfully delete the request', (done) => {
        chai.request(app)
          .delete(`/api/v1/users/requests/${requestId}`)
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object').with.property('message').equals('The request was succesfully deleted');
            done();
          });
      });
    });
    describe('supplies an ivalid request id', () => {
      it('should ask the user to supply a valid request id', (done) => {
        chai.request(app)
          .delete(`/api/v1/users/requests/${requestId}a`)
          .set('Authorization', `${userToken}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object').with.property('message')
              .equals('child "requestId" fails because [you entered an invalid request id. ' +
              'A request id can only be a positive integer.]');
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
