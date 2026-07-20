const test = require('node:test');
const assert = require('node:assert/strict');
const validarSocio = require('../src/utils/validarSocio');

test('rechaza cuando faltan todos los campos', () => {
  const errores = validarSocio({});
  assert.equal(errores.length, 4);
});

test('rechaza correo con formato inválido', () => {
  const errores = validarSocio({
    nombre: 'Ana Pérez',
    matricula: 'M-001',
    correo: 'no-es-un-correo',
    telefono: '809-555-0000',
  });
  assert.ok(errores.some((e) => e.includes('correo')));
});

test('acepta datos válidos', () => {
  const errores = validarSocio({
    nombre: 'Ana Pérez',
    matricula: 'M-001',
    correo: 'ana@example.com',
    telefono: '809-555-0000',
  });
  assert.deepEqual(errores, []);
});

test('rechaza campos con solo espacios en blanco', () => {
  const errores = validarSocio({
    nombre: '   ',
    matricula: 'M-001',
    correo: 'ana@example.com',
    telefono: '809-555-0000',
  });
  assert.ok(errores.some((e) => e.includes('nombre')));
});
