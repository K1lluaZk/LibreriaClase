const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/hash');

const prisma = new PrismaClient();

async function main() {
  const correo = process.env.ADMIN_CORREO;
  const password = process.env.ADMIN_PASSWORD;

  if (!correo || !password) {
    console.error('Definí ADMIN_CORREO y ADMIN_PASSWORD en tu .env antes de correr este script.');
    process.exit(1);
  }

  const existente = await prisma.usuario.findUnique({ where: { correo } });
  if (existente) {
    console.log(`Ya existe un usuario con el correo ${correo}, no se crea de nuevo.`);
    return;
  }

  const passwordHasheada = await hashPassword(password);

  await prisma.usuario.create({
    data: {
      nombre: process.env.ADMIN_NOMBRE || 'Administrador',
      matricula: process.env.ADMIN_MATRICULA || 'ADMIN-001',
      correo,
      telefono: process.env.ADMIN_TELEFONO || '000-000-0000',
      password: passwordHasheada,
      rol: 'ADMINISTRADOR',
    },
  });

  console.log(`Usuario administrador creado con correo ${correo}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
