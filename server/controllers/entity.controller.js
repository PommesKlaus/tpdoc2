import Entity from '../models/entity.model';

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
function get(req, res) {
  return res.json(req.entity);
}

/**
 * Create new entity
 * @property {string} req.body.name - The name of entity.
 * @property {string} req.body.shortname - The shortname of entity.
 * @property {string} req.body.country - The country of entity.
 * @property {string} req.body.questionnaire - The questionnaire of entity.
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

  entity.save()
    .then(savedEntity => res.json(savedEntity))
    .catch(e => next(e));
}

/**
 * Update existing entity
 * @property {string} req.body.name - The name of entity.
 * @property {string} req.body.shortname - The shortname of entity.
 * @property {string} req.body.country - The country of entity.
 * @property {string} req.body.questionnaire - The questionnaire of entity.
 * @returns {Entity}
 */
function update(req, res, next) {
  const entity = req.entity;
  entity.name = req.body.name,
  entity.shortname = req.body.shortname,
  entity.country = req.body.country,
  entity.questionnaire = req.body.questionnaire

  entity.save()
    .then(savedEntity => res.json(savedEntity))
    .catch(e => next(e));
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
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete entity.
 * @returns {Entity}
 */
function remove(req, res, next) {
  const entity = req.entity;
  entity.remove()
    .then(deletedEntity => res.json(deletedEntity))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
