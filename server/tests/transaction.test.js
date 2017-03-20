import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import Transaction from '../models/transaction.model';
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

describe('## Transaction APIs', () => {
  /**
   * Provide Initial Data
   */

  let testTransactions = [
    {
      name: 'Project X',
      type: 'Service Agreement',
      begin: new Date('2010-01-01'),
      personsOfContact: [],
      entities: [
        {
          entityId: '12303dc8b326492f30e6e23a',
          name: 'XYZ Ltd.',
          type: 'Corporation',
          country: 'GB'
        },
        {
          entityId: 'abc03dc8b326492f30e6e23a',
          name: 'Unlimited S.A.',
          type: 'Corporation',
          country: 'FR'
        }
      ],
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
    Transaction.create(testTransactions, (err, data) => {
      testTransactions = data;
      done();
    });
  });

  after((done) => {
    // Delete Initial Data
    Transaction.remove({ _id: { $in: testTransactions.map(cv => cv._id) } }, () => {
      done();
    });
  });

  /**
   * Start Test
   */

  let transaction = {
    name: 'Interco Loan 50M (2022)',
    type: 'Financing',
    begin: new Date('2015-01-01'),
    end: new Date('2022-06-30'),
    personsOfContact: [],
    entities: [
      {
        entityId: '12303dc8b326492f30e6e23a',
        name: 'XYZ Ltd.',
        type: 'Corporation',
        country: 'GB'
      }
    ],
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
    describe('- Calling transaction-API without a valid JWT', () => {
      it('GET /api/transactions/ should return UNAUTHORIZED', (done) => {
        request(app)
          .get('/api/transactions')
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('POST /api/transactions/ should return UNAUTHORIZED', (done) => {
        request(app)
          .post('/api/transactions')
          .send(transaction)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`GET /api/transactions/${testTransactions[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .get(`/api/transactions/${testTransactions[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`PUT /api/transactions/${testTransactions[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .put(`/api/transactions/${testTransactions[0]._id}`)
          .send(transaction)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it(`DELETE /api/transactions/${testTransactions[0]._id} should return UNAUTHORIZED`, (done) => {
        request(app)
          .delete(`/api/transactions/${testTransactions[0]._id}`)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling transaction-API with a valid JWT (standard user)', () => {
      let normalUserToken = 'Bearer ';

      it('GET /api/transactions/ should return UNAUTHORIZED', (done) => {
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
          .get('/api/transactions')
          .set('Authorization', normalUserToken)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            // console.log(normalUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/transactions/ should return OK', (done) => {
        request(app)
          .post('/api/transactions')
          .set('Authorization', normalUserToken)
          .send(transaction)
          .expect(httpStatus.OK)
          .then((res) => {
            transaction = res.body;
            testTransactions.push(transaction);
            done();
          })
          .catch(done);
      });

      it('GET /api/transactions/:transactionId should return OK', (done) => {
        request(app)
          .get(`/api/transactions/${testTransactions[0]._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/transactions/:transactionId should return OK', (done) => {
        request(app)
          .put(`/api/transactions/${transaction._id}`)
          .set('Authorization', normalUserToken)
          .send(transaction)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/transactions/:entityId should return UNAUTHORIZED', (done) => {
        request(app)
          .delete(`/api/transactions/${transaction._id}`)
          .set('Authorization', normalUserToken)
          .expect(httpStatus.UNAUTHORIZED)
          .then(() => {
            done();
          })
          .catch(done);
      });
    });

    describe('- Calling transaction-API with a valid JWT (TP user)', () => {
      let tpUserToken = 'Bearer ';

      it('GET /api/transactions/ should return OK', (done) => {
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
          .get('/api/transactions')
          .set('Authorization', tpUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            // console.log(tpUserToken)
            done();
          })
          .catch(done);
      });

      it('POST /api/transactions/ should return OK', (done) => {
        request(app)
          .post('/api/transactions')
          .set('Authorization', tpUserToken)
          .send(transaction)
          .expect(httpStatus.OK)
          .then((res) => {
            transaction = res.body;
            done();
          })
          .catch(done);
      });

      it('GET /api/transactions/:transactionId should return OK', (done) => {
        request(app)
          .get(`/api/transactions/${transaction._id}`)
          .set('Authorization', tpUserToken)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('PUT /api/transactions/:transactionId should return OK', (done) => {
        request(app)
          .put(`/api/transactions/${transaction._id}`)
          .set('Authorization', tpUserToken)
          .send(transaction)
          .expect(httpStatus.OK)
          .then(() => {
            done();
          })
          .catch(done);
      });

      it('DELETE /api/transactions/:transactionId should return OK', (done) => {
        request(app)
          .delete(`/api/transactions/${transaction._id}`)
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

    describe('- GET /api/transactions/?entities=...', () => {
      it('entities=[12303dc8b326492f30e6e23a, abc03dc8b326492f30e6e23a] should return an array of length 2', (done) => {
        request(app)
        .get('/api/transactions/?entities=12303dc8b326492f30e6e23a&entities=abc03dc8b326492f30e6e23a')
        .set('Authorization', tpUserToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array').with.lengthOf(2);
          done();
        })
        .catch(done);
      });

      it('entities=[12303dc8b326492f30e6e23a] should return an array of length 2', (done) => {
        request(app)
        .get('/api/transactions/?entities=12303dc8b326492f30e6e23a')
        .set('Authorization', tpUserToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array').with.lengthOf(2);
          done();
        })
        .catch(done);
      });

      it('entities=[abc03dc8b326492f30e6e23a] should return an array of length 1', (done) => {
        request(app)
        .get('/api/transactions/?entities=abc03dc8b326492f30e6e23a')
        .set('Authorization', tpUserToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array').with.lengthOf(1);
          done();
        })
        .catch(done);
      });
    });

    describe('- GET /api/transactions/', () => {
      it('returned array elements should be condensed', (done) => {
        request(app)
        .get('/api/transactions')
        .set('Authorization', tpUserToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('type');
          expect(res.body[0]).to.have.property('createdAt');
          expect(res.body[0]).not.to.have.property('questionnaire');
          expect(res.body[0]).not.to.have.property('updatedAt');
          done();
        })
        .catch(done);
      });
    });


  //   describe('- POST /api/entites', () => {
  //     it('should ignore submitted properties which are not part of the Entity-model and
  //     auto-create sub-property "groups" in questionnaire', (done) => {
  //       request(app)
  //       .post('/api/transactions')
  //       .set('Authorization', tpUserToken)
  //       .send({
  //         name: 'XXX',
  //         shortname: 'X',
  //         type: 'Corporation',
  //         country: 'DE',
  //         questionnaire: {},
  //         noPropertyOfTheModel: '..'
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         testTransactions.push(res.body); // Add to array so it gets deleted after test finished
  //         expect(res.body).not.to.have.property('noPropertyOfTheModel');
  //         expect(res.body.questionnaire).to.have.property('groups');
  //         done();
  //       })
  //       .catch(done);
  //     });

  //     it('should return BAD REQUEST if unallowed values are submitted', (done) => {
  //       request(app)
  //       .post('/api/transactions')
  //       .set('Authorization', tpUserToken)
  //       .send({
  //         name: 'XXX',
  //         shortname: 'X',
  //         type: 'Corporation',
  //         country: 'ABC', // may only contain 2 characters
  //         questionnaire: 'XYZ' // must be an object
  //       })
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then(() => {
  //         done();
  //       })
  //       .catch(done);
  //     });
  //   });
  });
});
