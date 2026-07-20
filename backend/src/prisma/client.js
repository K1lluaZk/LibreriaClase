const { PrismaClient } = require('@prisma/client');

// Singleton: reutiliza la misma instancia en toda la app en vez de crear
// una conexión nueva por cada archivo que necesite acceder a la base de datos.
const prisma = new PrismaClient();

module.exports = prisma;
