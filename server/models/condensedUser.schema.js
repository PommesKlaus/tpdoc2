import mongoose from 'mongoose';

/**
 * Condensed User Schema
 */
const CondensedUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  eMail: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  }
}, {
  _id: false,
  id: false
});

export default CondensedUserSchema;
