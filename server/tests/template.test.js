import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import chai from 'chai';
// import chai, { expect } from 'chai';
import app from '../../index';
import Template from '../models/template.model';
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

describe('## Template APIs', () => {
  /**
   * Provide Initial Data
   */

  let testTemplate = [
    {
      for: 'entity',
      type: 'Corporation',
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
    Template.create(testTemplate, (err, data) => {
      testTemplate = data;
      done();
    });
  });

  after((done) => {
    // Delete Initial Data
    Template.remove({ _id: { $in: testTemplate.map(cv => cv._id) } }, () => {
      done();
    });
  });

  /**
   * Start Test
   */

  let template = {
    for: 'entity',
    type: 'Partnership',
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
    describe('- Calling template-API without a valid JWT', () => {
      it('GET /api/templates/ should return UNAUTHORIZED', (done) => {
        request(app)
          .get('/api/templates')
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('POST /api/templates/ should return UNAUTHORIZED', (done) => {
        request(app)
          .post('/api/templates')
          .send(template)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`GET /api/templates/${testTemplate[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .get(`/api/templates/${testTemplate[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`PUT /api/templates/${testTemplate[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .put(`/api/templates/${testTemplate[0]._id}`)
          .send(template)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`DELETE /api/templates/${testTemplate[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .delete(`/api/templates/${testTemplate[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling templates-API with a valid JWT (standard user)', () => {
      let normalUserToken = 'Bearer ';

      it('GET /api/templates/ should return OK', (done) => {
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
          .get('/api/templates')
          .set('Authorization', normalUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            // console.log(normalUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/templates/ should return UNAUTHORIZED', (done) => {
        request(app)
          .post('/api/templates')
          .set('Authorization', normalUserToken)
          .send(template)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('GET /api/templates/:templateId should return OK', (done) => {
        request(app)
          .get(`/api/templates/${testTemplate[0]._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/templates/:templateId should return UNAUTHORIZED', (done) => {
        request(app)
          .put(`/api/templates/${testTemplate[0]._id}`)
          .set('Authorization', normalUserToken)
          .send(template)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/templates/:entityId should return UNAUTHORIZED', (done) => {
        request(app)
          .delete(`/api/templates/${testTemplate[0]._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling templates-API with a valid JWT (Admin user)', () => {
      let adminUserToken = 'Bearer ';

      it('GET /api/templates/ should return OK', (done) => {
        adminUserToken += jwt.sign(
          {
            eMail: 'normalUser@localhost.com',
            roles: ['x', 'tp', 'admin']
          },
          config.jwtSecret,
          {
            issuer: config.jwtIssuer,
            expiresIn: config.jwtExpiresIn
          }
        );
        request(app)
          .get('/api/templates')
          .set('Authorization', adminUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            // console.log(tpUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/templates/ should return OK', (done) => {
        request(app)
          .post('/api/templates')
          .set('Authorization', adminUserToken)
          .send(template)
          .expect(httpStatus.OK)
          .then((res) => {
            template = res.body;
            done();
          })
          .catch(done);
      });

      it('GET /api/templates/:templateId should return OK', (done) => {
        request(app)
          .get(`/api/templates/${template._id}`)
          .set('Authorization', adminUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/templates/:templateId should return OK', (done) => {
        request(app)
          .put(`/api/templates/${template._id}`)
          .set('Authorization', adminUserToken)
          .send(template)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/templates/:templateId should return OK', (done) => {
        request(app)
          .delete(`/api/templates/${template._id}`)
          .set('Authorization', adminUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });
  });

  // describe('# Content Checks', () => {
  //   let tpUserToken = 'Bearer ';
  //   tpUserToken += jwt.sign(
  //     {
  //       eMail: 'tpUser@localhost.com',
  //       roles: ['x', 'tp', 'y']
  //     },
  //     config.jwtSecret,
  //     {
  //       issuer: config.jwtIssuer,
  //       expiresIn: config.jwtExpiresIn
  //     }
  //   );
  //   // console.log(tpUserToken)

  //   describe('- GET /api/templates/?for=...', () => {
  //     it('entities=[12303dc8b326492f30e6e23a] should return an array of length 2', (done) => {
  //       request(app)
  //       .get('/api/transactions/?entities=12303dc8b326492f30e6e23a')
  //       .set('Authorization', tpUserToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.be.an('array').with.lengthOf(2);
  //         done();
  //       })
  //       .catch(done);
  //     });

  //     it('entities=[12303dc8b326492f30e6e23a] should return an array of length 2', (done) => {
  //       request(app)
  //       .get('/api/transactions/?entities=12303dc8b326492f30e6e23a')
  //       .set('Authorization', tpUserToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.be.an('array').with.lengthOf(2);
  //         done();
  //       })
  //       .catch(done);
  //     });

  //     it('entities=[abc03dc8b326492f30e6e23a] should return an array of length 1', (done) => {
  //       request(app)
  //       .get('/api/transactions/?entities=abc03dc8b326492f30e6e23a')
  //       .set('Authorization', tpUserToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.be.an('array').with.lengthOf(1);
  //         done();
  //       })
  //       .catch(done);
  //     });
  //   });

  //   describe('- GET /api/transactions/', () => {
  //     it('returned array elements should be condensed', (done) => {
  //       request(app)
  //       .get('/api/transactions')
  //       .set('Authorization', tpUserToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body[0]).to.have.property('name');
  //         expect(res.body[0]).to.have.property('type');
  //         expect(res.body[0]).to.have.property('createdAt');
  //         expect(res.body[0]).not.to.have.property('questionnaire');
  //         expect(res.body[0]).not.to.have.property('updatedAt');
  //         done();
  //       })
  //       .catch(done);
  //     });
  //   });


  // //   describe('- POST /api/entites', () => {
  // //     it('should ignore submitted properties which are not part of the Entity-model and
  // //     auto-create sub-property "groups" in questionnaire', (done) => {
  // //       request(app)
  // //       .post('/api/transactions')
  // //       .set('Authorization', tpUserToken)
  // //       .send({
  // //         name: 'XXX',
  // //         shortname: 'X',
  // //         type: 'Corporation',
  // //         country: 'DE',
  // //         questionnaire: {},
  // //         noPropertyOfTheModel: '..'
  // //       })
  // //       .expect(httpStatus.OK)
  // //       .then((res) => {
  // //         testTransactions.push(res.body);
  // //         expect(res.body).not.to.have.property('noPropertyOfTheModel');
  // //         expect(res.body.questionnaire).to.have.property('groups');
  // //         done();
  // //       })
  // //       .catch(done);
  // //     });

  // //     it('should return BAD REQUEST if unallowed values are submitted', (done) => {
  // //       request(app)
  // //       .post('/api/transactions')
  // //       .set('Authorization', tpUserToken)
  // //       .send({
  // //         name: 'XXX',
  // //         shortname: 'X',
  // //         type: 'Corporation',
  // //         country: 'ABC', // may only contain 2 characters
  // //         questionnaire: 'XYZ' // must be an object
  // //       })
  // //       .expect(httpStatus.BAD_REQUEST)
  // //       .then(() => {
  // //         done();
  // //       })
  // //       .catch(done);
  // //     });
  // //   });
  // });
});
