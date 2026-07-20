// Corré este script ANTES de "npx prisma db push" con el nuevo schema.
// Lee directamente la columna "disponible" (que todavía existe en el archivo
// físico de SQLite) y la guarda en un JSON para poder migrarla después.
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, '..', 'prisma', 'libreria.db');
const outPath = path.join(__dirname, '..', 'prisma', 'disponibilidad-backup.json');

const db = new DatabaseSync(dbPath);
const filas = db.prepare('SELECT id, disponible FROM libros').all();
db.close();

fs.writeFileSync(outPath, JSON.stringify(filas, null, 2));
console.log(`Se exportaron ${filas.length} registros a ${outPath}`);
