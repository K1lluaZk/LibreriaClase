const prisma = require('../prisma/client');
const ApiError = require('../utils/ApiError');
const validarSocio = require('../utils/validarSocio');

// Solo se exponen estos campos: nunca password/rol en las respuestas de socios.
const SELECT_SOCIO = {
  id: true,
  nombre: true,
  matricula: true,
  correo: true,
  telefono: true,
  activo: true,
  createdAt: true,
};

const getAll = () => {
  return prisma.usuario.findMany({
    where: { rol: null },
    select: SELECT_SOCIO,
    orderBy: { id: 'desc' },
  });
};

const getById = async (id) => {
  const socio = await prisma.usuario.findFirst({
    where: { id: Number(id), rol: null },
    select: SELECT_SOCIO,
  });
  if (!socio) throw new ApiError(404, 'Socio no encontrado');
  return socio;
};

// Traduce el error de restricción única (P2002) de Prisma a un mensaje claro.
const manejarErrorUnico = (err) => {
  if (err.code === 'P2002') {
    const campo = err.meta?.target?.includes('matricula') ? 'matrícula' : 'correo';
    throw new ApiError(409, `Ya existe un socio registrado con esa ${campo}`);
  }
  throw err;
};

const create = async ({ nombre, matricula, correo, telefono }) => {
  const errores = validarSocio({ nombre, matricula, correo, telefono });
  if (errores.length) throw new ApiError(400, errores.join('. '));

  try {
    return await prisma.usuario.create({
      data: { nombre, matricula, correo, telefono, rol: null },
      select: SELECT_SOCIO,
    });
  } catch (err) {
    manejarErrorUnico(err);
  }
};

const update = async (id, { nombre, matricula, correo, telefono }) => {
  await getById(id); // lanza 404 si no existe o no es socio

  const errores = validarSocio({ nombre, matricula, correo, telefono });
  if (errores.length) throw new ApiError(400, errores.join('. '));

  try {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, matricula, correo, telefono },
      select: SELECT_SOCIO,
    });
  } catch (err) {
    manejarErrorUnico(err);
  }
};

const remove = async (id) => {
  await getById(id); // lanza 404 si no existe o no es socio
  await prisma.usuario.delete({ where: { id: Number(id) } });
  return { mensaje: 'Socio eliminado correctamente' };
};

module.exports = { getAll, getById, create, update, remove };
