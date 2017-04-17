import httpStatus from 'http-status';
import Template from '../models/template.model';
import APIError from '../helpers/APIError';

/**
 * Load tempalte and append to req.
 */

function load(req, res, next, id) {
  Template.get(id)
  .then((template) => {
    req.template = template; // eslint-disable-line no-param-reassign
    return next();
  })
  .catch(e => next(e));
}

/**
 * Get Template
 * @returns {Template}
 */
function get(req, res) {
  res.json(req.template);
}

/**
 * Create new template
 * @property {string} req.body.for - Template belongs to? "entity" or "transaction".
 * @property {string} req.body.type - The type of the tempalte.
 * @property {string} req.body.version - The version of the tempalte.
 * @property {object} req.body.questionnaire - The questionnaire part of the template.
 * @returns {Template}
 */
function create(req, res, next) {
  const template = new Template({
    for: req.body.for,
    type: req.body.type,
    version: req.body.version,
    questionnaire: req.body.questionnaire
  });

  if (req.user.roles.indexOf('admin') !== -1) {
    template.save()
    .then(savedTemplate => res.json(savedTemplate))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

/**
 * Update existing template
 * @property {string} req.body.for - Template belongs to? "entity" or "transaction".
 * @property {string} req.body.type - The type of the tempalte.
 * @property {string} req.body.version - The version of the tempalte.
 * @property {object} req.body.questionnaire - The questionnaire part of the template.
 * @returns {Template}
 */
function update(req, res, next) {
  const template = req.template;
  template.for = req.body.for;
  template.type = req.body.type;
  template.version = req.body.version;
  template.questionnaire = req.body.questionnaire;

  if (req.user.roles.indexOf('admin') !== -1) {
    template.save()
    .then(savedTemplate => res.json(savedTemplate))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

/**
 * Get template list.
 * @property {string} req.query.for - Return templates for entities or transactions
 * @returns {Template[]}
 */
function list(req, res, next) {
  const forFilter = req.query;

  Template.list(forFilter)
  .then(templates => res.json(templates))
  .catch(e => next(e));
}

/**
 * Delete template.
 * @returns {Template}
 */
function remove(req, res, next) {
  const template = req.template;

  if (req.user.roles.indexOf('admin') !== -1) {
    template.remove()
    .then(deletedTemplate => res.json(deletedTemplate))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

export default { load, get, create, update, list, remove };
