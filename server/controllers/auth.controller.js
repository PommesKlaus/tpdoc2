import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../../config/config';
import User from '../models/user.model';
import APIError from '../helpers/APIError';


/**
 * Returns jwt token if valid eMail and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findByEMail(req.body.eMail).then((user) => {
    user.comparePassword(req.body.password, (e, isMatch) => {
      if (isMatch && !e) {
        const token = jwt.sign(
          {
            eMail: user.eMail,
            id: user._id,
            roles: user.roles
          },
          config.jwtSecret,
          {
            issuer: config.jwtIssuer,
            expiresIn: config.jwtExpiresIn
          }
        );
        res.json({
          token,
          eMail: user.eMail
        });
      } else {
        const pwdMissmatch = new APIError('Wrong Username and/or Password', httpStatus.UNAUTHORIZED);
        next(pwdMissmatch);
      }
    });
  })
  .catch(err => next(err));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
