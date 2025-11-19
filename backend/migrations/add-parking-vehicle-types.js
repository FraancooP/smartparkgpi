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
    
    // Agregar cantidad_lugares_auto si no existe
    if (!existingColumns.includes('cantidad_lugares_auto')) {
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN cantidad_lugares_auto INT 
        DEFAULT 0 
        COMMENT 'Cantidad total de lugares para autos'
        AFTER tarifa_auto
      `);
      console.log('✅ Columna cantidad_lugares_auto agregada');
    } else {
      console.log('⏭️  Columna cantidad_lugares_auto ya existe');
    }

    // Agregar cantidad_lugares_moto si no existe
    if (!existingColumns.includes('cantidad_lugares_moto')) {
      await connection.query(`
        ALTER TABLE estacionamientos 
        ADD COLUMN cantidad_lugares_moto INT 
        DEFAULT 0 
        COMMENT 'Cantidad total de lugares para motos'
        AFTER cantidad_lugares_auto
      `);
      console.log('✅ Columna cantidad_lugares_moto agregada');
    } else {
      console.log('⏭️  Columna cantidad_lugares_moto ya existe');
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
