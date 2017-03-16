import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
import config from '../../config/config';
import User from '../models/user.model'

chai.config.includeStack = true;

describe('## General Auth APIs', () => {

  /**
   * Provide Initial Data for Testcompany
   */ 

  let testUsers = [
    {
    eMail: 'tpUser@localhost.com',
    password: 'Password123',
    firstName: 'TP',
    lastName: 'User',
    roles: ['x', 'tp', 'y']
    },
    {
    eMail: 'adminUser@localhost.com',
    password: 'Password123',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin', 'y']
    },
    {
    eMail: 'normalUser@localhost.com',
    password: 'Password123',
    firstName: 'Normal',
    lastName: 'User',
    roles: ['x', 'y']
    }
  ]

  before((done) => {
    // Create Initial Data
    User.create(testUsers, (err, data) => {
      if (err) console.log(err)
      testUsers = data
      done()
    })
  });

  after((done) => {
    // Delete Initial Data
    User.remove({_id: {$in: testUsers.map((cv) => { return cv._id })}}, (err) => {
      if (err) console.log(err)
      done();
    })
  });

  /**
   * Start Test
   */

  const validUserCredentials = {
    eMail: 'tpUser@localhost.com',
    password: 'Password123'
  };

  const invalidUserCredentials = {
    eMail: 'react',
    password: 'IDontKnow'
  };

  let jwtToken;

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
            expect(decoded.roles).to.include.members(['tp'])
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });
  });

});
