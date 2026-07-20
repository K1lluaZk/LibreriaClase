const prisma = require('../prisma/client');
const ApiError = require('../utils/ApiError');
const validarLibro = require('../utils/validarLibro');

// filtros: { q, categoria } -- ambos opcionales, para HU-003 (búsqueda)
const getAll = (filtros = {}) => {
  const { q, categoria } = filtros;
  const where = {};

  if (categoria) where.categoria = categoria;
  if (q) {
    where.OR = [
      { titulo: { contains: q } },
      { autor: { contains: q } },
      { isbn: { contains: q } },
    ];
  }

  return prisma.libro.findMany({ where, orderBy: { id: 'desc' } });
};

const getById = async (id) => {
  const libro = await prisma.libro.findUnique({ where: { id: Number(id) } });
  if (!libro) throw new ApiError(404, 'Libro no encontrado');
  return libro;
};

const create = ({ titulo, autor, isbn, anio, categoria, cantidadDisponible }) => {
  const errores = validarLibro({ titulo, autor, categoria, cantidadDisponible });
  if (errores.length) throw new ApiError(400, errores.join('. '));

  return prisma.libro.create({
    data: {
      titulo,
      autor,
      isbn: isbn || null,
      anio: anio ?? null,
      categoria,
      cantidadDisponible: Number(cantidadDisponible),
    },
  });
};

const update = async (id, datos) => {
  const existente = await getById(id); // lanza 404 si no existe

  const combinado = {
    titulo: datos.titulo ?? existente.titulo,
    autor: datos.autor ?? existente.autor,
    isbn: datos.isbn ?? existente.isbn,
    anio: datos.anio ?? existente.anio,
    categoria: datos.categoria ?? existente.categoria,
    cantidadDisponible: datos.cantidadDisponible ?? existente.cantidadDisponible,
  };

  const errores = validarLibro(combinado);
  if (errores.length) throw new ApiError(400, errores.join('. '));

  return prisma.libro.update({
    where: { id: Number(id) },
    data: { ...combinado, cantidadDisponible: Number(combinado.cantidadDisponible) },
  });
};

const remove = async (id) => {
  await getById(id); // lanza 404 si no existe
  await prisma.libro.delete({ where: { id: Number(id) } });
  return { mensaje: 'Libro eliminado correctamente' };
};

// Mantiene el comportamiento original: sembrar 3 libros si la tabla está vacía.
const seedIfEmpty = async () => {
  const total = await prisma.libro.count();
  if (total > 0) return;

  await prisma.libro.createMany({
    data: [
      { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: '978-0307474728', anio: 1967, categoria: 'Novela', cantidadDisponible: 3 },
      { titulo: '1984', autor: 'George Orwell', isbn: '978-0451524935', anio: 1949, categoria: 'Ciencia ficción', cantidadDisponible: 2 },
      { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', isbn: '978-0156012195', anio: 1943, categoria: 'Infantil', cantidadDisponible: 1 },
    ],
  });
};

module.exports = { getAll, getById, create, update, remove, seedIfEmpty };
