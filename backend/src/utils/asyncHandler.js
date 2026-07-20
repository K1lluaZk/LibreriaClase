// Envuelve un controlador async y pasa cualquier error a next(),
// para que lo capture el middleware de manejo de errores centralizado.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
