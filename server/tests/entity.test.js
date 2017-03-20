import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import Entity from '../models/entity.model';
import config from '../../config/config';

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
   * Provide Initial Data
   */

  // const expiredUser = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  //   eyJlTWFpbCI6Im5vcm1hbFVzZXJAbG9jYWxob3N0LmNvbSIsInJvbGVzIjpbIn
  //   giLCJ5Il0sImlhdCI6MTQ4OTQ0MjI1MywiZXhwIjoxNDg5NDg1NDUzLCJpc3Mi
  //   OiJ0cGRvYyJ9.ZXhXjS9hY-22WniYwPqWqb1rb_gUNV92d2LkpYOD0m8`;

  let testEntities = [
    {
      name: 'Testco 1',
      shortname: 'T01',
      type: 'Corporation',
      country: 'DE',
      questionnaire: {
        description: '...',
        groups: [
          {
            title: 'AAA',
            description: '... ...',
            questions: []
          }
        ]
      }
    }
  ];

  before((done) => {
    // Create Initial Data
    Entity.create(testEntities, (err, data) => {
      // if (err) console.log(err)
      testEntities = data;
      done();
    });
  });

  after((done) => {
    // Delete Initial Data
    Entity.remove({ _id: { $in: testEntities.map(cv => cv._id) } }, () => {
      // if (err) console.log(err)
      done();
    });
  });

  /**
   * Start Test
   */

  let entity = {
    name: 'Testco 2',
    shortname: 'T02',
    type: 'Partnership',
    country: 'FR',
    questionnaire: {
      description: '...',
      groups: [
        {
          title: 'AAA',
          description: '... ...',
          questions: []
        }
      ]
    }
  };

  /**
   * Test to make sure only users with proper authentication can access routes
   */

  describe('# Authentication checks', () => {
    describe('- Calling entity-API without a valid JWT', () => {
      it('GET /api/entities/ should return UNAUTHORIZED', (done) => {
        request(app)
          .get('/api/entities')
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('POST /api/entities/ should return UNAUTHORIZED', (done) => {
        request(app)
          .post('/api/entities')
          .send(entity)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`GET /api/entities/${testEntities[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .get(`/api/entities/${testEntities[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`PUT /api/entities/${testEntities[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .put(`/api/entities/${testEntities[0]._id}`)
          .send(entity)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`DELETE /api/entities/${testEntities[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .delete(`/api/entities/${testEntities[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling entity-API with a valid JWT (standard user)', () => {
      let normalUserToken = 'Bearer ';

      it('GET /api/entities/ should return OK', (done) => {
        normalUserToken += jwt.sign(
          {
            eMail: 'normalUser@localhost.com',
            roles: []
          },
          config.jwtSecret,
          {
            issuer: config.jwtIssuer,
            expiresIn: config.jwtExpiresIn
          }
        );
        request(app)
          .get('/api/entities')
          .set('Authorization', normalUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            // console.log(normalUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/entities/ should return UNAUTHORIZED', (done) => {
        request(app)
          .post('/api/entities')
          .set('Authorization', normalUserToken)
          .send(entity)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('GET /api/entities/:entityId should return UNAUTHORIZED', (done) => {
        request(app)
          .get(`/api/entities/${testEntities[0]._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/entities/:entityId should return UNAUTHORIZED', (done) => {
        request(app)
          .put(`/api/entities/${testEntities[0]._id}`)
          .set('Authorization', normalUserToken)
          .send(entity)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/entities/:entityId should return UNAUTHORIZED', (done) => {
        request(app)
          .delete(`/api/entities/${testEntities[0]._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling entity-API with a valid JWT (TP user)', () => {
      let tpUserToken = 'Bearer ';

      it('GET /api/entities/ should return OK', (done) => {
        tpUserToken += jwt.sign(
          {
            eMail: 'normalUser@localhost.com',
            roles: ['x', 'tp', 'y']
          },
          config.jwtSecret,
          {
            issuer: config.jwtIssuer,
            expiresIn: config.jwtExpiresIn
          }
        );
        request(app)
          .get('/api/entities')
          .set('Authorization', tpUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            // console.log(normalUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/entities/ should return OK', (done) => {
        request(app)
          .post('/api/entities')
          .set('Authorization', tpUserToken)
          .send(entity)
          .expect(httpStatus.OK)
          .then((res) => {
            entity = res.body;
            done();
          })
          .catch(done);
      });

      it('GET /api/entities/:entityId should return OK', (done) => {
        request(app)
          .get(`/api/entities/${entity._id}`)
          .set('Authorization', tpUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/entities/:entityId should return OK', (done) => {
        request(app)
          .put(`/api/entities/${entity._id}`)
          .set('Authorization', tpUserToken)
          .send(entity)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/entities/:entityId should return OK', (done) => {
        request(app)
          .delete(`/api/entities/${entity._id}`)
          .set('Authorization', tpUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });
  });

  describe('# Content Checks', () => {
    let tpUserToken = 'Bearer ';
    tpUserToken += jwt.sign(
      {
        eMail: 'tpUser@localhost.com',
        roles: ['x', 'tp', 'y']
      },
      config.jwtSecret,
      {
        issuer: config.jwtIssuer,
        expiresIn: config.jwtExpiresIn
      }
    );
    // console.log(tpUserToken)

    describe('- GET /api/entities', () => {
      it('should return an array with condensed presentations of entities', (done) => {
        request(app)
        .get('/api/entities')
        .set('Authorization', tpUserToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('shortname');
          expect(res.body[0]).to.have.property('country');
          expect(res.body[0]).to.have.property('type');
          expect(res.body[0]).not.to.have.property('questionnaire');
          expect(res.body[0]).not.to.have.property('updatedAt');
          expect(res.body[0]).not.to.have.property('createdAt');
          done();
        })
        .catch(done);
      });
    });

    describe('- POST /api/entites', () => {
      it('should ignore props which are not part of the Entity-model and auto-create sub-property "groups" in questionnaire', (done) => {
        request(app)
        .post('/api/entities')
        .set('Authorization', tpUserToken)
        .send({
          name: 'XXX',
          shortname: 'X',
          type: 'Corporation',
          country: 'DE',
          questionnaire: {},
          noPropertyOfTheModel: '..'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          testEntities.push(res.body); // Add to array so it gets deleted after test finished
          expect(res.body).not.to.have.property('noPropertyOfTheModel');
          expect(res.body.questionnaire).to.have.property('groups');
          done();
        })
        .catch(done);
      });

      it('should return BAD REQUEST if unallowed values are submitted', (done) => {
        request(app)
        .post('/api/entities')
        .set('Authorization', tpUserToken)
        .send({
          name: 'XXX',
          shortname: 'X',
          type: 'Corporation',
          country: 'ABC', // may only contain 2 characters
          questionnaire: 'XYZ' // must be an object
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(() => {
          done();
        })
        .catch(done);
      });
    });


    /**
     * TODO:
     * Implement DELETE test using the currently not implemented virtual value "deletable".
     *
     * Logic:
     * a) Set an entity as "parentReportingEntity" of another entity.
     *    Then try to DELETE the first entity. Should return an error.
     * b) Set an entity as participant in a transaction.
     *    Then try to delete the entity. Should return an error.
     */
  });
});
