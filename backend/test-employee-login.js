const { Usuario, Rol, Estacionamiento } = require('./src/models/Asociador_tablas');

(async () => {
  try {
    console.log('🔍 Buscando empleados en la base de datos...\n');
    
    const empleados = await Usuario.findAll({
      include: [{
        model: Rol,
        as: 'rol',
        where: { rol_empleado: true }
      }]
    });

    if (empleados.length === 0) {
      console.log('❌ No hay empleados registrados');
      process.exit();
    }

    console.log('✅ Empleados encontrados:\n');
    
    for (const emp of empleados) {
      // Buscar estacionamiento asignado
      const estacionamiento = await Estacionamiento.findOne({
        where: { empleado_id: emp.id }
      });

      console.log(`ID: ${emp.id}`);
      console.log(`Usuario: ${emp.nombre_usuario}`);
      console.log(`Nombre: ${emp.nombre} ${emp.apellido}`);
      console.log(`Email: ${emp.correo}`);
      console.log(`Estado: ${emp.estado}`);
      console.log(`Estacionamiento: ${estacionamiento ? estacionamiento.nombre_estacionamiento : 'No asignado'}`);
      console.log('---');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
