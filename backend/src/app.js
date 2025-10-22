const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);     // Rutas de autenticación
app.use('/api/admin', adminRoutes);   // Rutas de administrador







// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SmartPark API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;