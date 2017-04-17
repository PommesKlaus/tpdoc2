import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import QuestionnaireSchema from './questionnaire.schema';

/**
 * Template Schema
 */

const TemplateSchema = new mongoose.Schema({
  for: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: false
  },
  questionnaire: QuestionnaireSchema
}, {
  timestamps: true
});

/**
 * Methods
 */
TemplateSchema.method({
});

/**
 * Statics
 */
TemplateSchema.statics = {
  /**
   * Get template
   * @param {ObjectId} id - The objectId of template.
   * @returns {Promise<Template, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((template) => {
        if (template) {
          return template;
        }
        const err = new APIError('No such template exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List templates in descending order of "type".
   * @param {string} for - Filter Templates by "for".
   * @returns {Promise<Templates[]>}
   */
  list(forFilter) {
    return this.find(forFilter)
      .sort({ type: 1 })
      .select({
        for: 1,
        type: 1,
        questionnaire: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .exec();
  }
};

/**
 * @typedef Template
 */
export default mongoose.model('Template', TemplateSchema);
