require('dotenv').config();
const { testConnection, syncModels, createDatabaseIfNotExists } = require('../config/database-sequelize');
const { Administrador } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Crear la base de datos si no existe
    await createDatabaseIfNotExists();
    
    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Sincronizar modelos (crear tablas)
    await syncModels(true); // true = forzar recreación
    console.log('✅ Tablas creadas/actualizadas correctamente');

    // Crear administrador por defecto
    const adminDefault = await Administrador.findOrCreate({
      where: { correo: 'admin@smartpark.com' },
      defaults: {
        nombre_usuario: 'admin',
        correo: 'admin@smartpark.com',
        contrasena: '123456', // Se hasheará automáticamente
        nombre: 'Administrador',
        apellido: 'Principal',
        direccion: 'Dirección por defecto',
        telefono: '1234567890',
        estado: 'activo'
      }
    });

    if (adminDefault[1]) {
      console.log('✅ Administrador por defecto creado:');
      console.log('   👤 Usuario: admin');
      console.log('   📧 Correo: admin@smartpark.com');
      console.log('   🔑 Contraseña: 123456');
    } else {
      console.log('ℹ️  Administrador por defecto ya existe');
    }

    console.log('🎉 Base de datos inicializada correctamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
};

initializeDatabase();