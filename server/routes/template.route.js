import express from 'express';
// import validate from 'express-validation';
import expressJwt from 'express-jwt';
// import paramValidation from '../../config/param-validation';
import templateCtrl from '../controllers/template.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/templates - Get list of templates; filtered by param "for" (entity/transaction) */
  .get(expressJwt({ secret: config.jwtSecret }), templateCtrl.list)

  /** POST /api/templates - Create new transaction */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    // validate(paramValidation.createTemplate),
    templateCtrl.create
  );

router.route('/:templateId')
  /** GET /api/templates/:templateId - Get transaction */
  .get(expressJwt({ secret: config.jwtSecret }), templateCtrl.get)

  /** PUT /api/templates/:templateId - Update transaction */
  .put(
    expressJwt({ secret: config.jwtSecret }),
    // validate(paramValidation.updateTemplate),
    templateCtrl.update
  )

  /** DELETE /api/templates/:templateId - Delete transaction */
  .delete(expressJwt({ secret: config.jwtSecret }), templateCtrl.remove);

/** Load template when API with templateId route parameter is hit */
router.param('templateId', templateCtrl.load);

export default router;
