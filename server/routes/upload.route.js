import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import uploadCtrl from '../controllers/upload.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

  /** POST /api/uploads - Upload new file */
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(paramValidation.createUpload),
    uploadCtrl.create
  );

router.route('/:uploadId')
  /** GET /api/uploads/:uploadId - Get file */
  .get(
    expressJwt({ secret: config.jwtSecret }),
    uploadCtrl.get
    )

  /** DELETE /api/uploads/:uploadId - Delete file */
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    uploadCtrl.remove
    );

export default router;
