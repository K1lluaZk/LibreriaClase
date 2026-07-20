const { Router } = require('express');
const socioController = require('../controllers/socio.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

// Registrar/consultar socios es una tarea de mostrador: requiere estar logueado como staff.
router.use(authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'));

router.get('/', socioController.getAll);
router.get('/:id', socioController.getById);
router.post('/', socioController.create);
router.put('/:id', socioController.update);
router.delete('/:id', socioController.remove);

module.exports = router;
