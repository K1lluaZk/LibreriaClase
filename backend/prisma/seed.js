const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.libro.count();
  if (total > 0) {
    console.log('La tabla de libros ya tiene datos, no se siembra nada.');
    return;
  }

  await prisma.libro.createMany({
    data: [
      { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: '978-0307474728', anio: 1967, categoria: 'Novela', cantidadDisponible: 3 },
      { titulo: '1984', autor: 'George Orwell', isbn: '978-0451524935', anio: 1949, categoria: 'Ciencia ficción', cantidadDisponible: 2 },
      { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', isbn: '978-0156012195', anio: 1943, categoria: 'Infantil', cantidadDisponible: 1 },
    ],
  });

  console.log('Datos de ejemplo insertados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
