const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: 'localhost',
  port: 3307,
  user: 'smartpark_user',
  password: 'smartpark123',
  database: 'smartpark_db'
};

async function addOcupadoDesde() {
  let connection;
  
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Conectado a la base de datos');

    // Verificar si la columna ya existe
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'smartpark_db' 
      AND TABLE_NAME = 'lugares' 
      AND COLUMN_NAME = 'ocupado_desde'
    `);

    if (columns.length === 0) {
      // Agregar columna ocupado_desde
      await connection.query(`
        ALTER TABLE lugares 
        ADD COLUMN ocupado_desde DATETIME NULL 
        COMMENT 'Timestamp cuando el lugar fue ocupado'
      `);
      console.log('✅ Columna ocupado_desde agregada');
    } else {
      console.log('ℹ️ Columna ocupado_desde ya existe');
    }

    // Mostrar estructura actualizada
    const [tableInfo] = await connection.query(`
      DESCRIBE lugares
    `);
    
    console.log('\n📊 Estructura actualizada de la tabla lugares:');
    console.table(tableInfo);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Migración completada');
    }
    process.exit(0);
  }
}

addOcupadoDesde();
