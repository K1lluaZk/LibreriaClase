const prisma = require('../prisma/client');

const getResumen = async () => {
  const [totalLibros, totalUsuarios, prestamosActivos, agregadoDisponibles] = await Promise.all([
    prisma.libro.count(),
    prisma.usuario.count({ where: { rol: null } }),
    prisma.prestamo.count({ where: { estado: 'ACTIVO' } }),
    prisma.libro.aggregate({ _sum: { cantidadDisponible: true } }),
  ]);

  return {
    totalLibros,
    totalUsuarios,
    librosPrestados: prestamosActivos,
    librosDisponibles: agregadoDisponibles._sum.cantidadDisponible || 0,
  };
};

module.exports = { getResumen };
