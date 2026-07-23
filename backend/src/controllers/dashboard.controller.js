const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getResumen = asyncHandler(async (req, res) => {
  const resumen = await dashboardService.getResumen();
  res.json(resumen);
});

module.exports = { getResumen };
