const { Router } = require('express');
const libroRoutes = require('./libro.routes');
const authRoutes = require('./auth.routes');
const socioRoutes = require('./socio.routes');
const prestamoRoutes = require('./prestamo.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/libros', libroRoutes);
router.use('/socios', socioRoutes);
router.use('/prestamos', prestamoRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
