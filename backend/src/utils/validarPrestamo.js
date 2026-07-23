const validarPrestamo = ({ socioId, libroId, fechaLimite } = {}) => {
  const errores = [];

  if (!socioId || !Number.isInteger(Number(socioId)) || Number(socioId) <= 0) {
    errores.push('Debe seleccionar un socio válido');
  }

  if (!libroId || !Number.isInteger(Number(libroId)) || Number(libroId) <= 0) {
    errores.push('Debe seleccionar un libro válido');
  }

  if (fechaLimite !== undefined && fechaLimite !== null && fechaLimite !== '') {
    const fecha = new Date(fechaLimite);
    if (Number.isNaN(fecha.getTime())) {
      errores.push('La fecha límite no es una fecha válida');
    }
  }

  return errores;
};

module.exports = validarPrestamo;
