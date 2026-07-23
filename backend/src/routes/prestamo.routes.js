const { Router } = require('express');
const prestamoController = require('../controllers/prestamo.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

// Registrar y gestionar préstamos es una tarea de mostrador: requiere estar logueado como staff.
router.use(authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'));

router.get('/', prestamoController.getAll);
router.get('/:id', prestamoController.getById);
router.post('/', prestamoController.create);
router.put('/:id/devolver', prestamoController.devolver);

module.exports = router;
