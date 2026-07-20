const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve un array de mensajes de error. Vacío = datos válidos.
const validarSocio = ({ nombre, matricula, correo, telefono } = {}) => {
  const errores = [];

  if (!nombre || !nombre.trim()) errores.push('El nombre es obligatorio');
  if (!matricula || !matricula.trim()) errores.push('La matrícula es obligatoria');
  if (!telefono || !telefono.trim()) errores.push('El teléfono es obligatorio');

  if (!correo || !correo.trim()) {
    errores.push('El correo es obligatorio');
  } else if (!CORREO_REGEX.test(correo.trim())) {
    errores.push('El correo no tiene un formato válido');
  }

  return errores;
};

module.exports = validarSocio;
