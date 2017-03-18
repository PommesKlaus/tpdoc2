import mongoose from 'mongoose';

/**
 * Condensed Entity Schema
 */
const CondensedEntitySchema = new mongoose.Schema({
  entityId: {
    type: String,
    required: true
  },
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
  }
}, {
  _id: false,
  id: false
});

export default CondensedEntitySchema;
