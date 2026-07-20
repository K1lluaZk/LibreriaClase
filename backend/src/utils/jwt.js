const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('./ApiError');

const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
};

module.exports = { signToken, verifyToken };
