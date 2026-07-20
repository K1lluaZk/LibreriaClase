const libroService = require('../services/libro.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const { buscar, categoria } = req.query;
  const libros = await libroService.getAll({ q: buscar, categoria });
  res.json(libros);
});

const getById = asyncHandler(async (req, res) => {
  const libro = await libroService.getById(req.params.id);
  res.json(libro);
});

const create = asyncHandler(async (req, res) => {
  const nuevoLibro = await libroService.create(req.body);
  res.status(201).json(nuevoLibro);
});

const update = asyncHandler(async (req, res) => {
  const actualizado = await libroService.update(req.params.id, req.body);
  res.json(actualizado);
});

const remove = asyncHandler(async (req, res) => {
  const resultado = await libroService.remove(req.params.id);
  res.json(resultado);
});

module.exports = { getAll, getById, create, update, remove };
