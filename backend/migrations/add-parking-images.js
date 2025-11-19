const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'smartpark_user',
    password: 'smartpark_password',
    database: 'smartpark_db'
  });

  console.log('🔌 Conectando a MySQL...');

  try {
    // Verificar columnas existentes
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'smartpark_db' 
      AND TABLE_NAME = 'estacionamientos'
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Agregar imagen_1 si no existe
    if (!existingColumns.includes('imagen_1')) {
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN imagen_1 VARCHAR(500) 
        DEFAULT 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800' 
        COMMENT 'URL de la primera imagen del estacionamiento'
        AFTER tarifa_auto
      `);
      console.log('✅ Columna imagen_1 agregada');
    } else {
      console.log('⏭️  Columna imagen_1 ya existe');
    }

    // Agregar imagen_2 si no existe
    if (!existingColumns.includes('imagen_2')) {
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN imagen_2 VARCHAR(500) 
        DEFAULT 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800' 
        COMMENT 'URL de la segunda imagen del estacionamiento'
        AFTER imagen_1
      `);
      console.log('✅ Columna imagen_2 agregada');
    } else {
      console.log('⏭️  Columna imagen_2 ya existe');
    }

    // Agregar imagen_3 si no existe
    if (!existingColumns.includes('imagen_3')) {
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN imagen_3 VARCHAR(500) 
        DEFAULT 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800' 
        COMMENT 'URL de la tercera imagen del estacionamiento'
        AFTER imagen_2
      `);
      console.log('✅ Columna imagen_3 agregada');
    } else {
      console.log('⏭️  Columna imagen_3 ya existe');
    }

    // Mostrar estructura actualizada
    const [tableInfo] = await connection.query(`
      DESCRIBE estacionamientos
    `);
    console.log('\n📋 Estructura de la tabla estacionamientos:');
    console.table(tableInfo);

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  } finally {
    await connection.end();
    console.log('\n✅ Migración completada');
  }
}

runMigration().catch(console.error);
