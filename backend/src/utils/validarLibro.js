const validarLibro = ({ titulo, autor, categoria, cantidadDisponible } = {}) => {
  const errores = [];

  if (!titulo || !titulo.trim()) errores.push('El título es obligatorio');
  if (!autor || !autor.trim()) errores.push('El autor es obligatorio');
  if (!categoria || !categoria.trim()) errores.push('La categoría es obligatoria');

  if (cantidadDisponible === undefined || cantidadDisponible === null || cantidadDisponible === '') {
    errores.push('La cantidad disponible es obligatoria');
  } else if (!Number.isInteger(Number(cantidadDisponible)) || Number(cantidadDisponible) < 0) {
    errores.push('La cantidad disponible debe ser un número entero mayor o igual a 0');
  }

  return errores;
};

module.exports = validarLibro;
