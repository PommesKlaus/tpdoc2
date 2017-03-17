import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import QuestionnaireSchema from './questionnaire.schema';

/**
 * Entity Schema
 */

/**
 * TODO:
 * Implement additional property to schema "parentReportingEntity"
 *
 * Logic:
 * parentReportingEntity should be an object (optional), containing the properties
 * "name", "shortname" and "_id" of another entity which acts as a parent entity
 * and which must be included in the final TP-documentation to present a proper
 * documentation of the given company. Typically, a branch/permanent establishment
 * should not be presented on its own but togehter with the company it belongs to
 * (branch and company are essentially the same entity).
 */
const EntitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortname: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    match: [/^[A-Z]{2}$/, 'The value of path {PATH} ({VALUE}) is not a valid ISO 3166 Alpha-2 code.']
  },
  questionnaire: QuestionnaireSchema
}, {
  timestamps: true
});


/**
 * Virtuals
 */
EntitySchema.virtual('deletable').get(() => {
  /**
   * TODO:
   * Implement a check if entity can be deleted or not.
   *
   * Logic: Entity can only be deleted if
   * - it doesn't participate in a transaction (query/count transactions for this entity)
   * - it isn't a "parentReportingCompany" in another entity
   */
  const a = false;
  return a;
});

/**
 * Methods
 */
EntitySchema.method({
});

/**
 * Statics
 */
EntitySchema.statics = {
  /**
   * Get entity
   * @param {ObjectId} id - The objectId of entity.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((entity) => {
        if (entity) {
          return entity;
        }
        const err = new APIError('No such entity exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List entities in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @returns {Promise<Entity[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        name: 1,
        shortname: 1,
        country: 1,
        type: 1
      })
      .exec();
  }
};

/**
 * @typedef Entity
 */
export default mongoose.model('Entity', EntitySchema);
