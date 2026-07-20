const socioService = require('../services/socio.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const socios = await socioService.getAll();
  res.json(socios);
});

const getById = asyncHandler(async (req, res) => {
  const socio = await socioService.getById(req.params.id);
  res.json(socio);
});

const create = asyncHandler(async (req, res) => {
  const nuevoSocio = await socioService.create(req.body);
  res.status(201).json(nuevoSocio);
});

const update = asyncHandler(async (req, res) => {
  const actualizado = await socioService.update(req.params.id, req.body);
  res.json(actualizado);
});

const remove = asyncHandler(async (req, res) => {
  const resultado = await socioService.remove(req.params.id);
  res.json(resultado);
});

module.exports = { getAll, getById, create, update, remove };
