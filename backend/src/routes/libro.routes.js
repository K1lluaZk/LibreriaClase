const { Router } = require('express');
const libroController = require('../controllers/libro.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = Router();

// Lectura: pública (catálogo visible sin login)
router.get('/', libroController.getAll);
router.get('/:id', libroController.getById);

// Escritura: requiere estar autenticado y tener rol de staff
router.post('/', authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'), libroController.create);
router.put('/:id', authenticate, authorize('ADMINISTRADOR', 'BIBLIOTECARIO'), libroController.update);
router.delete('/:id', authenticate, authorize('ADMINISTRADOR'), libroController.remove);

module.exports = router;
