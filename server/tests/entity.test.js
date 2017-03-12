import mongoose from 'mongoose';
import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model'

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {  
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Entity APIs', () => {

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

  let entity = {
    name: 'Testcompany',
    shortname: 'T01',
    type: 'Corporation',
    country: 'DE',
    questionnaire: { groups: [] }
  };

  describe('# POST /api/entities', () => {
    it('should create a new entity', (done) => {
      request(app)
        .post('/api/entities')
        .send(entity)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(entity.name);
          expect(res.body.shortname).to.equal(entity.shortname);
          expect(res.body.type).to.equal(entity.type);
          expect(res.body.country).to.equal(entity.country);
          expect(res.body.questionnaire).to.be.an('object');
          entity = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/entities/:entityId', () => {
    it('should get entity details', (done) => {
      request(app)
        .get(`/api/entities/${entity._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(entity.name);
          expect(res.body.shortname).to.equal(entity.shortname);
          expect(res.body.type).to.equal(entity.type);
          expect(res.body.country).to.equal(entity.country);
          expect(res.body.questionnaire).to.be.an('object');
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when entity does not exists', (done) => {
      request(app)
        .get('/api/entities/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/entities/:entityId', () => {
    it('should update entity details', (done) => {
      entity.name = 'Bla Blub';
      request(app)
        .put(`/api/entities/${entity._id}`)
        .send(entity)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(entity.name);
          expect(res.body.shortname).to.equal(entity.shortname);
          expect(res.body.type).to.equal(entity.type);
          expect(res.body.country).to.equal(entity.country);
          expect(res.body.questionnaire).to.be.an('object');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/entities/', () => {
    it('should get all entities', (done) => {
      request(app)
        .get('/api/entities')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/entities/', () => {
    it('should delete entity', (done) => {
      request(app)
        .delete(`/api/entities/${entity._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(entity.name);
          expect(res.body.shortname).to.equal(entity.shortname);
          expect(res.body.type).to.equal(entity.type);
          expect(res.body.country).to.equal(entity.country);
          expect(res.body.questionnaire).to.be.an('object');
          done();
        })
        .catch(done);
    });
  });
});
