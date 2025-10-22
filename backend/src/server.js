const app = require('./app');
const { sequelize, createDatabaseIfNotExists } = require('./config/database-sequelize');
require('./models/Asociador_tablas'); // importa todos los modelos y define las asociaciones (esto ya incluye Company, no hace falta requerirlo aparte)


const PORT = process.env.PORT || 4000;

// Manejadores de errores globales
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado:', reason);
});

console.log('Iniciando sincronización de base de datos...');

// Crear la base de datos si no existe y luego sincronizar
createDatabaseIfNotExists()
  .then(() => {
    return sequelize.sync({ force: true }); // ⚠️ CUIDADO: Esto ELIMINA todas las tablas y las recrea
  })
  .then(async () => {
    console.log('✅ Base de datos sincronizada correctamente');
    console.log('⚠️  NOTA: sync({ force: true }) eliminó y recreó todas las tablas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });