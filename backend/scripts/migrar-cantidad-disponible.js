// Corré este script DESPUÉS de "npx prisma db push" con el nuevo schema
// (una vez que la columna cantidadDisponible ya existe).
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const backupPath = path.join(__dirname, '..', 'prisma', 'disponibilidad-backup.json');

async function main() {
  if (!fs.existsSync(backupPath)) {
    console.error('No se encontró el backup. Corré antes: node scripts/exportar-disponibilidad.js');
    process.exit(1);
  }

  const filas = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  for (const fila of filas) {
    await prisma.libro.update({
      where: { id: fila.id },
      data: { cantidadDisponible: fila.disponible ? 1 : 0 },
    });
  }

  console.log(`Se migraron ${filas.length} libros a cantidadDisponible.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
