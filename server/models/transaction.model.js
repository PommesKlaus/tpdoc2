import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import QuestionnaireSchema from './questionnaire.schema';
import CondensedEntitySchema from './condensedEntity.schema';
import CondensedUserSchema from './condensedUser.schema';

/**
 * Transaction Schema
 */

const TransactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  begin: {
    type: Date,
    required: false
  },
  end: {
    type: Date,
    required: false
  },
  personsOfContact: [CondensedUserSchema],
  entities: [CondensedEntitySchema],
  questionnaire: QuestionnaireSchema
}, {
  timestamps: true
});

/**
 * Methods
 */
TransactionSchema.method({
});

/**
 * Statics
 */
TransactionSchema.statics = {
  /**
   * Get transaction
   * @param {ObjectId} id - The objectId of transaction.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((transaction) => {
        if (transaction) {
          return transaction;
        }
        const err = new APIError('No such transaction exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List transactions in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of transactions to be skipped.
   * @param {number} limit - Limit number of transactions to be returned.
   * @returns {Promise<Transaction[]>}
   */
  list(skip = 0, limit = 50, filter = {}) {
    return this.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        name: 1,
        type: 1,
        createdAt: 1
      })
      .exec();
  }
};

/**
 * @typedef Transaction
 */
export default mongoose.model('Transaction', TransactionSchema);
