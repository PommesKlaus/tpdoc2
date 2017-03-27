import httpStatus from 'http-status';
import Transaction from '../models/transaction.model';
import APIError from '../helpers/APIError';

/**
 * Load transaction and append to req.
 */

function load(req, res, next, id) {
  Transaction.get(id)
  .then((transaction) => {
    req.transaction = transaction; // eslint-disable-line no-param-reassign
    return next();
  })
  .catch(e => next(e));
}

/**
 * Get Transaction
 * @returns {Transaction}
 */
function get(req, res) {
  res.json(req.transaction);
}

/**
 * Create new transaction
 * @property {string} req.body.name - The name of the transaction.
 * @property {string} req.body.type - The type of the transaction.
 * @property {string} req.body.begin - The Date the transaction begins.
 * @property {string} req.body.end - The Date the transaction ends.
 * @property {array} req.body.personsOfContact - The Users who can be contacted.
 * @property {array} req.body.entities - The Entities participating in the transaction ends.
 * @property {object} req.body.questionnaire - The questionnaire of the transaction.
 * @returns {Transaction}
 */
function create(req, res, next) {
  const transaction = new Transaction({
    name: req.body.name,
    type: req.body.type,
    begin: req.body.begin,
    end: req.body.end,
    personsOfContact: req.body.personsOfContact,
    entities: req.body.entities,
    questionnaire: req.body.questionnaire
  });

  transaction.save()
  .then(savedTransaction => res.json(savedTransaction))
  .catch(e => next(e));
}

/**
 * Update existing transaction
 * @property {string} req.body.name - The name of the transaction.
 * @property {string} req.body.type - The type of the transaction.
 * @property {string} req.body.begin - The Date the transaction begins.
 * @property {string} req.body.end - The Date the transaction ends.
 * @property {array} req.body.personsOfContact - The Users who can be contacted.
 * @property {array} req.body.entities - The Entities participating in the transaction ends.
 * @property {object} req.body.questionnaire - The questionnaire of the transaction.
 * @returns {Transaction}
 */
function update(req, res, next) {
  const transaction = req.transaction;
  transaction.name = req.body.name;
  transaction.type = req.body.type;
  transaction.begin = req.body.begin;
  transaction.end = req.body.end;
  transaction.personsOfContact = req.body.personsOfContact;
  transaction.entities = req.body.entities;
  transaction.questionnaire = req.body.questionnaire;

  transaction.save()
  .then(savedTransaction => res.json(savedTransaction))
  .catch(e => next(e));
}

/**
 * Get transaction list.
 * @property {number} req.query.skip - Number of transactions to be skipped.
 * @property {number} req.query.limit - Limit number of transactions to be returned.
 * @returns {Transaction[]}
 */
function list(req, res, next) {
  const filter = {};

  if (typeof (req.query.entities) !== 'undefined') {
    // query contains a filter for entities...
    filter['entities.entityId'] = { $in: [].concat(req.query.entities) };
  }

  if (typeof (req.query.type) !== 'undefined') {
    // query contains a filter for transaction type...
    filter['entities.type'] = req.query.type;
  }

  const { limit = 50, skip = 0 } = req.query;

  if (req.user.roles.indexOf('tp') !== -1) {
    Transaction.list(skip, limit, filter)
    .then(transactions => res.json(transactions))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

/**
 * Delete transaction.
 * @returns {Transaction}
 */
function remove(req, res, next) {
  const transaction = req.transaction;

  if (req.user.roles.indexOf('tp') !== -1) {
    transaction.remove()
    .then(deletedTransaction => res.json(deletedTransaction))
    .catch(e => next(e));
  } else {
    const err = new APIError('You are not allowed to perform this action', httpStatus.UNAUTHORIZED);
    next(err);
  }
}

export default { load, get, create, update, list, remove };
