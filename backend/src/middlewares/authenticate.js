const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No se proporcionó un token de autenticación'));
  }

  const token = header.split(' ')[1];
  const payload = verifyToken(token); // lanza ApiError(401) si es inválido

  req.usuario = payload; // { id, nombre, rol }
  next();
};

module.exports = authenticate;
