import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import QuestionnaireSchema from './questionnaire.model'

/**
 * Entity Schema
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
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

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
      .exec();
  }
};

/**
 * @typedef Entity
 */
export default mongoose.model('Entity', EntitySchema);
