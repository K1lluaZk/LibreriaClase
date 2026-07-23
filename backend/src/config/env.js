require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  DIAS_PRESTAMO_DEFAULT: Number(process.env.DIAS_PRESTAMO_DEFAULT) || 14,
};

if (!env.JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET (revisa tu archivo .env)');
}

module.exports = env;
