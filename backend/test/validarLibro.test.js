const test = require('node:test');
const assert = require('node:assert/strict');
const validarLibro = require('../src/utils/validarLibro');

test('rechaza cuando faltan todos los campos', () => {
  const errores = validarLibro({});
  assert.equal(errores.length, 4);
});

test('rechaza cantidadDisponible negativa', () => {
  const errores = validarLibro({
    titulo: '1984',
    autor: 'George Orwell',
    categoria: 'Ciencia ficción',
    cantidadDisponible: -1,
  });
  assert.ok(errores.some((e) => e.includes('cantidad disponible')));
});

test('rechaza cantidadDisponible no entera', () => {
  const errores = validarLibro({
    titulo: '1984',
    autor: 'George Orwell',
    categoria: 'Ciencia ficción',
    cantidadDisponible: 2.5,
  });
  assert.ok(errores.some((e) => e.includes('cantidad disponible')));
});

test('acepta datos válidos, incluyendo cantidadDisponible en 0', () => {
  const errores = validarLibro({
    titulo: '1984',
    autor: 'George Orwell',
    categoria: 'Ciencia ficción',
    cantidadDisponible: 0,
  });
  assert.deepEqual(errores, []);
});
