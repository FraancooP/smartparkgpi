const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Función para crear la base de datos si no existe
const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'smartpark_user',
    password: process.env.DB_PASSWORD || 'smartpark_password'
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'smartpark_db'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Base de datos '${process.env.DB_NAME || 'smartpark_db'}' verificada/creada`);
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
};

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
  createDatabaseIfNotExists,
  Sequelize
};