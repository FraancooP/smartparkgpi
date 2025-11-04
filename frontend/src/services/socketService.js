import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

class SocketService {
  constructor() {
    this.socket = null
    this.connected = false
  }

  // Conectar al servidor Socket.io
  connect() {
    if (this.socket && this.connected) {
      console.log('Socket ya está conectado')
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket.io conectado:', this.socket.id)
      this.connected = true
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.io desconectado:', reason)
      this.connected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión Socket.io:', error.message)
    })

    return this.socket
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      console.log('Socket.io desconectado manualmente')
    }
  }

  // Unirse a la sala de un estacionamiento
  joinParking(parkingId) {
    if (this.socket && this.connected) {
      this.socket.emit('join-parking', parkingId)
      console.log(`📍 Unido a sala: parking-${parkingId}`)
    }
  }

  // Salir de la sala de un estacionamiento
  leaveParking(parkingId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave-parking', parkingId)
      console.log(`📤 Salió de sala: parking-${parkingId}`)
    }
  }

  // Escuchar evento de actualización de lugar
  onSpotUpdated(callback) {
    if (this.socket) {
      this.socket.on('spot-updated', callback)
    }
  }

  // Dejar de escuchar evento de actualización de lugar
  offSpotUpdated(callback) {
    if (this.socket) {
      this.socket.off('spot-updated', callback)
    }
  }

  // Obtener instancia del socket
  getSocket() {
    return this.socket
  }

  // Verificar si está conectado
  isConnected() {
    return this.connected && this.socket?.connected
  }
}

// Exportar instancia única (singleton)
const socketService = new SocketService()
export default socketService
