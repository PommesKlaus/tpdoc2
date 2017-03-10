import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
import config from '../../config/config';

chai.config.includeStack = true;

describe('## General Auth APIs', () => {
  let dummyUser = {
    eMail: 'test@localhost.com',
    password: 'Password123',
    firstName: 'Test',
    lastName: 'User',
    roles: ['admin', 'tp']
  };

  const validUserCredentials = {
    eMail: 'test@localhost.com',
    password: 'Password123'
  };

  const invalidUserCredentials = {
    eMail: 'react',
    password: 'IDontKnow'
  };

  let jwtToken;

  // Create Dummy Users and check authorization

  describe('# Create Initial Dummy User', () => {
    it('should be successful', (done) => {
      request(app).post('/api/users').send(dummyUser).expect(httpStatus.OK).then((res) => {
          dummyUser = res.body;
          done();
        }).catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should return Unauthorized error', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.eMail).to.equal(validUserCredentials.eMail);
            expect(decoded.roles).to.include.members(['tp']);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
          // done()
        })
        .catch(done);
    });
  });

  describe('# GET /api/auth/random-number', () => {
    it('should fail to get random number because of missing Authorization', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should fail to get random number because of wrong token', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should get a random number', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.num).to.be.a('number');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete dummy user (normal privileges)', (done) => {
      request(app)
        .delete(`/api/users/${dummyUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          done();
        })
        .catch(done);
    });
  });

});
