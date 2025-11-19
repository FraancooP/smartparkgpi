const mysql = require('mysql2/promise');

async function addImagenesColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'smartpark_user',
    password: 'smartpark_password',
    database: 'smartpark_db'
  });

  console.log('🔌 Conectando a MySQL...');

  try {
    // Verificar si la columna ya existe
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'smartpark_db' 
      AND TABLE_NAME = 'estacionamientos' 
      AND COLUMN_NAME = 'imagenes'
    `);

    if (columns.length > 0) {
      console.log('⏭️  Columna imagenes ya existe');
    } else {
      // Agregar columna imagenes (JSON)
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN imagenes JSON NULL AFTER tarifa_auto
      `);
      console.log('✅ Columna imagenes agregada correctamente');
    }

    // Mostrar estructura actualizada
    const [tableStructure] = await connection.query(`
      DESCRIBE estacionamientos
    `);
    console.log('\n📋 Estructura actualizada de la tabla estacionamientos:');
    console.table(tableStructure);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
    console.log('🔌 Conexión cerrada');
  }
}

addImagenesColumn();
