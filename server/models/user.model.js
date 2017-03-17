import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  eMail: {
    type: String,
    required: true,
    unique: true,
    match: [config.eMailRegExp, 'The value of path {PATH} ({VALUE}) is not a valid e-mail adress.']
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  roles: {
    type: [String],
    required: false,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function save(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) next();

  bcrypt.hash(user.password, SALT_WORK_FACTOR, (err, hash) => {
    if (err) next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

/**
 * Methods
 */
UserSchema.method({
  comparePassword: function comparePassword(pwd, cb) {
    bcrypt.compare(pwd, this.password, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  findByEMail(addr) {
    return this.findOne({ eMail: addr })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
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
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
