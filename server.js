const express = require('express');
const cors = require('cors');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new DatabaseSync(path.join(__dirname, 'libreria.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    isbn TEXT,
    anio INTEGER,
    disponible INTEGER DEFAULT 1
  )
`);

const totalLibros = db.prepare('SELECT COUNT(*) AS c FROM libros').get().c;
if (totalLibros === 0) {
  const insertar = db.prepare(
    'INSERT INTO libros (titulo, autor, isbn, anio, disponible) VALUES (?, ?, ?, ?, ?)'
  );
  insertar.run('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 1967, 1);
  insertar.run('1984', 'George Orwell', '978-0451524935', 1949, 1);
  insertar.run('El Principito', 'Antoine de Saint-Exupéry', '978-0156012195', 1943, 1);
}

app.get('/api/libros', (req, res) => {
  const libros = db.prepare('SELECT * FROM libros ORDER BY id DESC').all();
  res.json(libros);
});

app.get('/api/libros/:id', (req, res) => {
  const libro = db.prepare('SELECT * FROM libros WHERE id = ?').get(req.params.id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
});

app.post('/api/libros', (req, res) => {
  const { titulo, autor, isbn, anio, disponible } = req.body;
  if (!titulo || !autor) {
    return res.status(400).json({ error: 'El título y el autor son obligatorios' });
  }
  const stmt = db.prepare(
    'INSERT INTO libros (titulo, autor, isbn, anio, disponible) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(titulo, autor, isbn || '', anio || null, disponible ? 1 : 0);
  const nuevoLibro = db.prepare('SELECT * FROM libros WHERE id = ?').get(Number(info.lastInsertRowid));
  res.status(201).json(nuevoLibro);
});

app.put('/api/libros/:id', (req, res) => {
  const { titulo, autor, isbn, anio, disponible } = req.body;
  const existente = db.prepare('SELECT * FROM libros WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ error: 'Libro no encontrado' });

  db.prepare(
    'UPDATE libros SET titulo = ?, autor = ?, isbn = ?, anio = ?, disponible = ? WHERE id = ?'
  ).run(
    titulo ?? existente.titulo,
    autor ?? existente.autor,
    isbn ?? existente.isbn,
    anio ?? existente.anio,
    disponible !== undefined ? (disponible ? 1 : 0) : existente.disponible,
    req.params.id
  );

  const actualizado = db.prepare('SELECT * FROM libros WHERE id = ?').get(req.params.id);
  res.json(actualizado);
});

app.delete('/api/libros/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM libros WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ error: 'Libro no encontrado' });

  db.prepare('DELETE FROM libros WHERE id = ?').run(req.params.id);
  res.json({ mensaje: 'Libro eliminado correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor de la librería corriendo en http://localhost:${PORT}`);
});
