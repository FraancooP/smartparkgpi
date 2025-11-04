const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, createDatabaseIfNotExists } = require('./config/database-sequelize');
require('./models/Asociador_tablas'); // importa todos los modelos y define las asociaciones

const PORT = process.env.PORT || 4000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // En producción, especifica el dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Agregar io al objeto app para usarlo en los controladores
app.set('io', io);

// Middleware para agregar io a las peticiones
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Eventos de Socket.io
io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id);

  // Escuchar cuando un cliente se desconecta
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });

  // El cliente puede unirse a una "sala" específica de un estacionamiento
  socket.on('join-parking', (parkingId) => {
    socket.join(`parking-${parkingId}`);
    console.log(`Cliente ${socket.id} se unió a parking-${parkingId}`);
  });

  socket.on('leave-parking', (parkingId) => {
    socket.leave(`parking-${parkingId}`);
    console.log(`Cliente ${socket.id} salió de parking-${parkingId}`);
  });
});

// Manejadores de errores globales
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado:', reason);
});

console.log('Iniciando sincronización de base de datos...');

// Crear la base de datos si no existe y luego sincronizar
createDatabaseIfNotExists()
  .then(() => {
    return sequelize.sync({ force: true }); // ⚠️ CUIDADO: Esto ELIMINA todas las tablas y las recrea
  })
  .then(async () => {
    console.log('✅ Base de datos sincronizada correctamente');
    console.log('⚠️  NOTA: sync({ force: true }) eliminó y recreó todas las tablas');

    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔌 WebSocket (Socket.io) habilitado`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });