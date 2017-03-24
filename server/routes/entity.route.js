import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import entityCtrl from '../controllers/entity.controller';
import uploadCtrl from '../controllers/upload.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/entities - Get list of entities */
  .get(expressJwt({ secret: config.jwtSecret }), entityCtrl.list)

  /** POST /api/entities - Create new entity */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createEntity),
    entityCtrl.create
  );

router.route('/:entityId')
  /** GET /api/entities/:entityId - Get entity */
  .get(expressJwt({ secret: config.jwtSecret }), entityCtrl.get)

  /** PUT /api/entities/:entityId - Update entity */
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.updateEntity),
    entityCtrl.update
  )

  /** DELETE /api/entities/:entityId - Delete entity */
  .delete(expressJwt({ secret: config.jwtSecret }), entityCtrl.remove);

router.route('/:belongsToId/attachments')
  /** GET /api/entities/:entityId/attachments - Get entity attachments */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.listUpload),
    uploadCtrl.list
  );

/** Load entity when API with entityId route parameter is hit */
router.param('entityId', entityCtrl.load);

export default router;
