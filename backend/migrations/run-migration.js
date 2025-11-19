const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    console.log('🔌 Conectando a MySQL...');
    
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'smartpark_user',
      password: 'smartpark_password',
      database: 'smartpark_db'
    });

    console.log('✅ Conexión establecida');
    console.log('📝 Ejecutando migraciones...\n');

    // Verificar si las columnas ya existen
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM estacionamientos"
    );
    
    const columnNames = columns.map(col => col.Field);
    
    // Agregar matricula si no existe
    if (!columnNames.includes('matricula')) {
      console.log('➕ Agregando columna: matricula');
      await connection.execute(
        "ALTER TABLE estacionamientos ADD COLUMN matricula VARCHAR(50) NULL AFTER informacion"
      );
      console.log('   ✅ Columna matricula agregada');
    } else {
      console.log('⏭️  Columna matricula ya existe');
    }

    // Agregar tarifa_moto si no existe
    if (!columnNames.includes('tarifa_moto')) {
      console.log('➕ Agregando columna: tarifa_moto');
      await connection.execute(
        "ALTER TABLE estacionamientos ADD COLUMN tarifa_moto DECIMAL(10, 2) NULL AFTER " + 
        (columnNames.includes('matricula') ? 'matricula' : 'informacion')
      );
      console.log('   ✅ Columna tarifa_moto agregada');
    } else {
      console.log('⏭️  Columna tarifa_moto ya existe');
    }

    // Agregar tarifa_auto si no existe
    if (!columnNames.includes('tarifa_auto')) {
      console.log('➕ Agregando columna: tarifa_auto');
      await connection.execute(
        "ALTER TABLE estacionamientos ADD COLUMN tarifa_auto DECIMAL(10, 2) NULL AFTER tarifa_moto"
      );
      console.log('   ✅ Columna tarifa_auto agregada');
    } else {
      console.log('⏭️  Columna tarifa_auto ya existe');
    }

    console.log('\n🎉 ¡Migración completada exitosamente!\n');

    // Mostrar estructura actualizada
    const [updatedColumns] = await connection.execute(
      "SHOW COLUMNS FROM estacionamientos"
    );
    
    console.log('📋 Estructura actualizada de la tabla estacionamientos:');
    console.table(updatedColumns.map(col => ({
      Campo: col.Field,
      Tipo: col.Type,
      Nulo: col.Null,
      Default: col.Default
    })));

  } catch (error) {
    console.error('\n❌ Error al ejecutar migración:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

runMigration();
