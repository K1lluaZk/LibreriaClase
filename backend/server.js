const env = require('./src/config/env');
const app = require('./src/app');
const libroService = require('./src/services/libro.service');

const start = async () => {
  await libroService.seedIfEmpty();

  app.listen(env.PORT, () => {
    console.log(`Servidor de la librería corriendo en http://localhost:${env.PORT}`);
  });
};

start();
