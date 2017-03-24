import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

// assign mongo-driver directly to the gridfs-stream module
Grid.mongo = mongoose.mongo;

let gfs;
mongoose.connection.on('open', () => {
  gfs = new Grid(mongoose.connection.db);
});

/**
 * Get File
 * @returns {File}
 */
function get(req, res, next) {
  gfs.findOne({ _id: req.params.uploadId }, (err, file) => {
    if (err) next(err);
    if (file) {
      const readstream = gfs.createReadStream({
        _id: req.params.uploadId
      });

      readstream.on('error', e => next(e));

      res.setHeader('Content-disposition', `inline; filename="${file.filename}"`);
      res.setHeader('Content-type', file.contentType);

      readstream.pipe(res);
    } else {
      const e = new APIError('No such file exists!', httpStatus.NOT_FOUND);
      next(e);
    }
  });
}

/**
 * Upload File
 * @property {string} req.body.belongsToId - id of the entity/transaction the file belongs to.
 * @property {string} req.files.filefield - The file(s) to be uploaded.
 * @returns {File}
 */
function create(req, res) {
  const f = req.files.filefield;

  const writestream = gfs.createWriteStream({
    filename: f.name,
    mode: 'w',
    content_type: f.mimetype,
    metadata: {
      belongsToId: req.body.belongsToId
    }
  });

  writestream.write(f.data);

  writestream.end();

  writestream.on('close', file => res.json(file));
}

/**
 * Get uploaded files list.
 * @property {string} req.query.belongsToId - The entity/transaction files belong to
 * @returns {Files[]}
 */
function list(req, res, next) {
  gfs.files.find({ 'metadata.belongsToId': req.params.belongsToId }).toArray((e, files) => {
    if (e) next(e);
    res.json(files);
  });
}

/**
 * Delete file.
 * @returns {File}
 */
function remove(req, res, next) {
  if (req.user.roles.indexOf('tp') !== -1) {
    gfs.findOne({ _id: req.params.uploadId }, (err, file) => {
      if (err) next(err);
      if (file) {
        gfs.remove({ _id: req.params.uploadId }, (e) => {
          if (e) next(e);
          res.json(file);
        });
      } else {
        const e = new APIError('No such file exists!', httpStatus.NOT_FOUND);
        next(e);
      }
    });
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

export default { get, create, list, remove };
