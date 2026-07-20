const ApiError = require('../utils/ApiError');

// Uso: router.post('/', authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'), controller)
const authorize = (...rolesPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    return next(new ApiError(401, 'No autenticado'));
  }

  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return next(new ApiError(403, 'No tienes permisos para realizar esta acción'));
  }

  next();
};

module.exports = authorize;
