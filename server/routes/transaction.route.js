import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import transactionCtrl from '../controllers/transaction.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/transactions - Get list of transactions */
  .get(expressJwt({ secret: config.jwtSecret }), transactionCtrl.list)

  /** POST /api/transactions - Create new transaction */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createTransaction),
    transactionCtrl.create
  );

router.route('/:transactionId')
  /** GET /api/transactions/:transactionId - Get transaction */
  .get(expressJwt({ secret: config.jwtSecret }), transactionCtrl.get)

  /** PUT /api/transactions/:transactionId - Update transaction */
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateTransaction),
    transactionCtrl.update
  )

  /** DELETE /api/transactions/:transactionId - Delete transaction */
  .delete(expressJwt({ secret: config.jwtSecret }), transactionCtrl.remove);

/** Load transaction when API with transactionId route parameter is hit */
router.param('transactionId', transactionCtrl.load);

export default router;
