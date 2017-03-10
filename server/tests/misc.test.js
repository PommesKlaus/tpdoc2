import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../index';

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# Check DB-connection', () => {
    it('should return "1" (connected)', (done) => {
      let conState = mongoose.connection.readyState;
      expect(conState).to.equal(1);
      // mongoose connection ready state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      done();
    })
  });

  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - eMail is required', (done) => {
      request(app)
        .post('/api/users')
        .send({
          password: 'ABC'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"eMail" is required');
          done();
        })
        .catch(done);
    });
  });
});
