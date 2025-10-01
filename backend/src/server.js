const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, syncModels } = require('./config/database-sequelize');

// Importar modelos
const { Administrador } = require('./models');

// Importar rutas (las crearemos después)
// const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos.'
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas principales (las habilitaremos cuando las creemos)
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SmartPark API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🅿️ Bienvenido a SmartPark API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      // auth: '/api/auth',
      // admin: '/api/admin'
    }
  });
});

// Ruta temporal para probar el modelo Administrador
app.get('/api/test-admin', async (req, res) => {
  try {
    const admins = await Administrador.findAll();
    res.json({
      message: 'Modelo Administrador funcionando',
      administradores: admins
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error consultando administradores',
      details: error.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos. Verifica Docker y la configuración.');
      process.exit(1);
    }

    // Sincronizar modelos (crear tablas si no existen)
    await syncModels(false); // false = no forzar recreación

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 ===================================');
      console.log(`🅿️  SmartPark API iniciado correctamente`);
      console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📊 Panel Admin: http://localhost:8080 (phpMyAdmin)`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  ORM: Sequelize`);
      console.log('🚀 ===================================');
    });

  } catch (error) {
    console.error('❌ Error al inicializar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre limpio
process.on('SIGTERM', () => {
  console.log('📴 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Cerrando servidor...');
  process.exit(0);
});

// Inicializar servidor
startServer();

module.exports = app;