const prisma = require('../prisma/client');
const ApiError = require('../utils/ApiError');
const validarPrestamo = require('../utils/validarPrestamo');
const env = require('../config/env');

const INCLUDE_RELACIONES = {
  socio: { select: { id: true, nombre: true, matricula: true } },
  libro: { select: { id: true, titulo: true, autor: true, isbn: true } },
};

const getAll = (filtros = {}) => {
  const { estado, socioId, libroId } = filtros;
  const where = {};
  if (estado) where.estado = estado;
  if (socioId) where.socioId = Number(socioId);
  if (libroId) where.libroId = Number(libroId);

  return prisma.prestamo.findMany({
    where,
    include: INCLUDE_RELACIONES,
    orderBy: { id: 'desc' },
  });
};

const getById = async (id) => {
  const prestamo = await prisma.prestamo.findUnique({
    where: { id: Number(id) },
    include: INCLUDE_RELACIONES,
  });
  if (!prestamo) throw new ApiError(404, 'Préstamo no encontrado');
  return prestamo;
};

const create = async ({ socioId, libroId, fechaLimite }) => {
  const errores = validarPrestamo({ socioId, libroId, fechaLimite });
  if (errores.length) throw new ApiError(400, errores.join('. '));

  const socioIdNum = Number(socioId);
  const libroIdNum = Number(libroId);

  // El socio debe existir y ser realmente un socio (rol null), no un miembro del staff.
  const socio = await prisma.usuario.findFirst({ where: { id: socioIdNum, rol: null } });
  if (!socio) throw new ApiError(404, 'Socio no encontrado');
  if (!socio.activo) throw new ApiError(403, 'El socio está inactivo');

  // Evita que el mismo socio tenga dos préstamos activos del mismo libro a la vez.
  const prestamoDuplicado = await prisma.prestamo.findFirst({
    where: { socioId: socioIdNum, libroId: libroIdNum, estado: 'ACTIVO' },
  });
  if (prestamoDuplicado) {
    throw new ApiError(409, 'Este socio ya tiene un préstamo activo de este libro');
  }

  const fechaPrestamo = new Date();
  const fechaLimiteFinal = fechaLimite
    ? new Date(fechaLimite)
    : new Date(fechaPrestamo.getTime() + env.DIAS_PRESTAMO_DEFAULT * 24 * 60 * 60 * 1000);

  return prisma.$transaction(async (tx) => {
    // Update condicional: solo descuenta si sigue habiendo ejemplares disponibles.
    // Esto evita la condición de carrera de dos préstamos simultáneos del último ejemplar.
    const resultado = await tx.libro.updateMany({
      where: { id: libroIdNum, cantidadDisponible: { gt: 0 } },
      data: { cantidadDisponible: { decrement: 1 } },
    });

    if (resultado.count === 0) {
      throw new ApiError(409, 'No hay ejemplares disponibles de este libro');
    }

    return tx.prestamo.create({
      data: {
        socioId: socioIdNum,
        libroId: libroIdNum,
        fechaPrestamo,
        fechaLimite: fechaLimiteFinal,
      },
      include: INCLUDE_RELACIONES,
    });
  });
};

const devolver = async (id) => {
  const prestamo = await getById(id);

  if (prestamo.estado === 'DEVUELTO') {
    throw new ApiError(400, 'Este préstamo ya fue devuelto');
  }

  return prisma.$transaction(async (tx) => {
    await tx.libro.update({
      where: { id: prestamo.libroId },
      data: { cantidadDisponible: { increment: 1 } },
    });

    return tx.prestamo.update({
      where: { id: Number(id) },
      data: { estado: 'DEVUELTO', fechaDevolucion: new Date() },
      include: INCLUDE_RELACIONES,
    });
  });
};

module.exports = { getAll, getById, create, devolver };
