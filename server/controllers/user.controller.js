import User from '../models/user.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.eMail - The e-mail of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The first name of user.
 * @property {string} req.body.lastName - The last Name of user.
 * @property {string} req.body.roles - The roles (as an array) of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    eMail: req.body.eMail,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    roles: req.body.roles
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.eMail - The e-mail of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.firstName - The first name of user.
 * @property {string} req.body.lastName - The last Name of user.
 * @property {string} req.body.roles - The roles (as an array) of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.eMail = req.body.eMail;
  user.password = req.body.password;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.roles = req.body.roles;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
