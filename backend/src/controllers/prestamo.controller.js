const prestamoService = require('../services/prestamo.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const { estado, socioId, libroId } = req.query;
  const prestamos = await prestamoService.getAll({ estado, socioId, libroId });
  res.json(prestamos);
});

const getById = asyncHandler(async (req, res) => {
  const prestamo = await prestamoService.getById(req.params.id);
  res.json(prestamo);
});

const create = asyncHandler(async (req, res) => {
  const nuevoPrestamo = await prestamoService.create(req.body);
  res.status(201).json(nuevoPrestamo);
});

const devolver = asyncHandler(async (req, res) => {
  const prestamo = await prestamoService.devolver(req.params.id);
  res.json(prestamo);
});

module.exports = { getAll, getById, create, devolver };
