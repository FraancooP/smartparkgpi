-- Agregar campos de matrícula y tarifas a la tabla estacionamientos
-- Ejecutar en MySQL Workbench o desde terminal

USE smartpark;

-- Agregar columna matricula
ALTER TABLE estacionamientos 
ADD COLUMN matricula VARCHAR(50) NULL COMMENT 'Matrícula o código de identificación del estacionamiento'
AFTER informacion;

-- Agregar columna tarifa_moto
ALTER TABLE estacionamientos 
ADD COLUMN tarifa_moto DECIMAL(10, 2) NULL COMMENT 'Tarifa por hora para motos (en pesos)'
AFTER matricula;

-- Agregar columna tarifa_auto
ALTER TABLE estacionamientos 
ADD COLUMN tarifa_auto DECIMAL(10, 2) NULL COMMENT 'Tarifa por hora para autos (en pesos)'
AFTER tarifa_moto;

-- Verificar que se agregaron correctamente
DESCRIBE estacionamientos;

SELECT 'Migración completada exitosamente' AS mensaje;
