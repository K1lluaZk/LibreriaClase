const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const resultado = await authService.login(req.body);
  res.json(resultado);
});

// El JWT es stateless: no hay sesión que invalidar en el servidor.
// El "logout" real ocurre en el cliente, descartando el token guardado.
// Se deja el endpoint para que el frontend tenga un flujo explícito de cierre de sesión.
const logout = asyncHandler(async (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
});

const me = asyncHandler(async (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = { login, logout, me };
