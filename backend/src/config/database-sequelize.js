const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión con Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'smartpark_db',
  process.env.DB_USER || 'smartpark_user', 
  process.env.DB_PASSWORD || 'smartpark_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
    define: {
      charset: 'utf8mb4',
      dialectOptions: {
        collate: 'utf8mb4_unicode_ci'
      }
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL con Sequelize establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con MySQL usando Sequelize:', error.message);
    return false;
  }
};

// Función para sincronizar modelos
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Modelos sincronizados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando modelos:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels,
  Sequelize
};