const test = require('node:test');
const assert = require('node:assert/strict');
const validarPrestamo = require('../src/utils/validarPrestamo');

test('rechaza cuando faltan socio y libro', () => {
  const errores = validarPrestamo({});
  assert.equal(errores.length, 2);
});

test('rechaza ids no numéricos o negativos', () => {
  const errores = validarPrestamo({ socioId: -1, libroId: 'abc' });
  assert.equal(errores.length, 2);
});

test('rechaza fechaLimite inválida', () => {
  const errores = validarPrestamo({ socioId: 1, libroId: 2, fechaLimite: 'no-es-fecha' });
  assert.ok(errores.some((e) => e.includes('fecha límite')));
});

test('acepta datos válidos sin fechaLimite (usa el default)', () => {
  const errores = validarPrestamo({ socioId: 1, libroId: 2 });
  assert.deepEqual(errores, []);
});

test('acepta fechaLimite válida', () => {
  const errores = validarPrestamo({ socioId: 1, libroId: 2, fechaLimite: '2026-08-01' });
  assert.deepEqual(errores, []);
});
