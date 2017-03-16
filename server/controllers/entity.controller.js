import httpStatus from 'http-status';
import Entity from '../models/entity.model';
import APIError from '../helpers/APIError'

/**
 * Load user and append to req.
 */

function load(req, res, next, id) {
  Entity.get(id)
  .then((entity) => {
    req.entity = entity; // eslint-disable-line no-param-reassign
    return next();
  })
  .catch(e => next(e));
}

/**
 * Get entity
 * @returns {Entity}
 */
function get(req, res, next) {
  if (req.user.roles.indexOf('tp') !== -1) {
    return res.json(req.entity);
  }
  const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
  next(err);  
}

/**
 * Create new entity
 * @property {string} req.body.name - The name of entity.
 * @property {string} req.body.shortname - The shortname of entity.
 * @property {string} req.body.country - The country of entity.
 * @property {object} req.body.questionnaire - The questionnaire of entity.
 * @returns {Entity}
 */
function create(req, res, next) {
  const entity = new Entity({
    name: req.body.name,
    shortname: req.body.shortname,
    type: req.body.type,
    country: req.body.country,
    questionnaire: req.body.questionnaire
  });

  if (req.user.roles.indexOf('tp') !== -1) {
    entity.save()
    .then(savedEntity => res.json(savedEntity))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

/**
 * Update existing entity
 * @property {string} req.body.name - The name of entity.
 * @property {string} req.body.shortname - The shortname of entity.
 * @property {string} req.body.country - The country of entity.
 * @property {object} req.body.questionnaire - The questionnaire of entity.
 * @returns {Entity}
 */
function update(req, res, next) {
  const entity = req.entity;
  entity.name = req.body.name,
  entity.shortname = req.body.shortname,
  entity.country = req.body.country,
  entity.questionnaire = req.body.questionnaire

  if (req.user.roles.indexOf('tp') !== -1) {
    entity.save()
    .then(savedEntity => res.json(savedEntity))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
  
}

/**
 * Get entity list.
 * @property {number} req.query.skip - Number of entities to be skipped.
 * @property {number} req.query.limit - Limit number of entities to be returned.
 * @returns {Entity[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Entity.list({ limit, skip })
    .then(entities => res.json(entities))
    .catch(e => next(e));
}

/**
 * Delete entity.
 * @returns {Entity}
 */
function remove(req, res, next) {
  const entity = req.entity;

  if (req.user.roles.indexOf('tp') !== -1) {
    entity.remove()
    .then(deletedEntity => res.json(deletedEntity))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
  
}

export default { load, get, create, update, list, remove };
