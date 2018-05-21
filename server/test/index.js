import chai from 'chai';
import 'chai/register-should';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

describe('/GET request to a valid route \'/\'', () => {
  it('should return a welcome message', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.body.should.be.an('object').with.property('message');
        done();
      });
  });
});

describe('/GET request to an invalid route \'/oio\'', () => {
  it('should return 404 error', (done) => {
    chai.request(app)
      .get('/oio')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('should return an error message', (done) => {
    chai.request(app)
      .get('/oio')
      .end((err, res) => {
        res.body.should.be.an('object').with.property('error');
        done();
      });
  });
});

describe('/GET request to an unimplemented route \'/ap1/v2\'', () => {
  it('should return 501 status', (done) => {
    chai.request(app)
      .get('/api/v2')
      .end((err, res) => {
        res.should.have.status(501);
        done();
      });
  });
});
