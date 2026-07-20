const prisma = require('../prisma/client');
const ApiError = require('../utils/ApiError');
const { comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

const sanitizar = (usuario) => {
  const { password, ...resto } = usuario;
  return resto;
};

const login = async ({ correo, password }) => {
  if (!correo || !password) {
    throw new ApiError(400, 'Correo y contraseña son obligatorios');
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo } });

  // rol === null  -> es un socio, no tiene acceso al sistema (login).
  // password null -> nunca se le asignó contraseña.
  if (!usuario || !usuario.rol || !usuario.password) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  if (!usuario.activo) {
    throw new ApiError(403, 'El usuario está inactivo');
  }

  const passwordValida = await comparePassword(password, usuario.password);
  if (!passwordValida) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = signToken({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });

  return { token, usuario: sanitizar(usuario) };
};

module.exports = { login };
