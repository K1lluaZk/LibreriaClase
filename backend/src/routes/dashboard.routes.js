const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

router.get('/', authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'), dashboardController.getResumen);

module.exports = router;
