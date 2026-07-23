const { Router } = require('express');
const libroRoutes = require('./libro.routes');
const authRoutes = require('./auth.routes');
const socioRoutes = require('./socio.routes');
const prestamoRoutes = require('./prestamo.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/libros', libroRoutes);
router.use('/socios', socioRoutes);
router.use('/prestamos', prestamoRoutes);

module.exports = router;
