# 📡 API REST - SmartPark Backend

## 🎯 Base URL
```
http://localhost:4000/api
```

---

## 🔐 Autenticación

Todas las rutas protegidas requieren header:
```
Authorization: Bearer <token_jwt>
```

---

## 📍 RUTAS DE ESTACIONAMIENTOS

### 1. **Crear Estacionamiento** (Admin)
```http
POST /api/admin/parkings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nombre_estacionamiento": "Patio Olmos",
  "latitud": -31.4201,
  "longitud": -64.1888,
  "informacion": "Centro comercial, 3 pisos"
}
```

**Respuesta:**
```json
{
  "mensaje": "Estacionamiento creado exitosamente",
  "estacionamiento": {
    "id": 1,
    "nombre": "Patio Olmos",
    "latitud": -31.4201,
    "longitud": -64.1888,
    "informacion": "Centro comercial, 3 pisos",
    "administrador_id": 5,
    "creado_en": "2025-11-04T19:30:00.000Z"
  }
}
```

---

### 2. **Listar Todos los Estacionamientos** (Público - para mapa del cliente)
```http
GET /api/client/parkings
```

**Respuesta:**
```json
{
  "total": 3,
  "estacionamientos": [
    {
      "id": 1,
      "nombre": "Patio Olmos",
      "lat": -31.4201,
      "lng": -64.1888,
      "informacion": "Centro comercial",
      "administrador": {
        "id": 5,
        "nombre": "Juan Pérez"
      },
      "empleado": {
        "id": 8,
        "nombre": "María González"
      },
      "disponibilidad": {
        "total": 50,
        "disponibles": 35,
        "ocupados": 10,
        "reservados": 5,
        "porcentaje": 70,
        "color": "green"  // 'green', 'yellow', 'red', 'gray'
      },
      "creado_en": "2025-11-04T19:30:00.000Z"
    }
  ]
}
```

**Colores según disponibilidad:**
- 🟢 **green**: ≥70% disponible
- 🟡 **yellow**: 30-69% disponible  
- 🔴 **red**: <30% disponible
- ⚫ **gray**: Sin lugares creados

---

### 3. **Obtener Estacionamiento por ID**
```http
GET /api/client/parkings/:id
```

---

### 4. **Mis Estacionamientos** (Admin logeado)
```http
GET /api/admin/my-parkings
Authorization: Bearer <admin_token>
```

---

### 5. **Actualizar Estacionamiento** (Admin dueño)
```http
PUT /api/admin/parkings/:id
Authorization: Bearer <admin_token>

{
  "nombre_estacionamiento": "Patio Olmos - Renovado",
  "informacion": "Nueva información"
}
```

---

### 6. **Eliminar Estacionamiento** (Admin dueño)
```http
DELETE /api/admin/parkings/:id
Authorization: Bearer <admin_token>
```

---

### 7. **Asignar Empleado a Estacionamiento** (Admin)
```http
POST /api/admin/assign-employee
Authorization: Bearer <admin_token>

{
  "estacionamiento_id": 1,
  "empleado_id": 8
}
```

**Respuesta:**
```json
{
  "mensaje": "Empleado asignado exitosamente",
  "estacionamiento": {
    "id": 1,
    "nombre": "Patio Olmos",
    "empleado": {
      "id": 8,
      "nombre": "María González"
    }
  }
}
```

---

## 🅿️ RUTAS DE LUGARES (SPOTS)

### 1. **Crear Lugar Individual** (Admin o Empleado)
```http
POST /api/admin/spots
Authorization: Bearer <token>

{
  "estacionamiento_id": 1,
  "numero_lugar": "A1",
  "tipo": "estandar"  // 'estandar', 'discapacitado', 'electrico', 'moto'
}
```

---

### 2. **Crear Múltiples Lugares** (Admin o Empleado)
```http
POST /api/admin/spots/bulk
Authorization: Bearer <token>

{
  "estacionamiento_id": 1,
  "cantidad": 50,
  "tipo": "estandar",
  "prefijo": "A"  // Generará: A1, A2, A3, ..., A50
}
```

**Respuesta:**
```json
{
  "mensaje": "50 lugares creados exitosamente",
  "lugares": [...]
}
```

---

### 3. **Listar Lugares de un Estacionamiento** (Admin o Empleado)
```http
GET /api/admin/parkings/:estacionamiento_id/spots
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "estacionamiento_id": 1,
  "total": 50,
  "disponibilidad": {
    "disponibles": 35,
    "ocupados": 10,
    "reservados": 5,
    "mantenimiento": 0,
    "porcentaje_disponible": 70
  },
  "lugares": [
    {
      "id": 1,
      "numero_lugar": "A1",
      "tipo": "estandar",
      "estado": "disponible",  // 'disponible', 'ocupado', 'reservado', 'mantenimiento'
      "estacionamiento_id": 1
    }
  ]
}
```

---

### 4. **Actualizar Estado de Lugar** (Admin o Empleado)
```http
PUT /api/admin/spots/:id/status
Authorization: Bearer <token>

{
  "estado": "ocupado"  // 'disponible', 'ocupado', 'reservado', 'mantenimiento'
}
```

**Respuesta:**
```json
{
  "mensaje": "Estado actualizado exitosamente",
  "lugar": {
    "id": 1,
    "numero_lugar": "A1",
    "estado": "ocupado"
  },
  "cambio": {
    "de": "disponible",
    "a": "ocupado"
  }
}
```

**⚡ Esto emite automáticamente un evento Socket.io:**
```javascript
socket.emit('spot-updated', {
  lugar_id: 1,
  estacionamiento_id: 1,
  estado: 'ocupado',
  numero_lugar: 'A1'
})
```

---

### 5. **Eliminar Lugar** (Admin o Empleado)
```http
DELETE /api/admin/spots/:id
Authorization: Bearer <token>
```

---

## 👷 RUTAS PARA EMPLEADOS

### 1. **Obtener Mi Estacionamiento Asignado**
```http
GET /api/employee/my-parking
Authorization: Bearer <empleado_token>
```

**Respuesta:**
```json
{
  "estacionamiento": {
    "id": 1,
    "nombre": "Patio Olmos",
    "lat": -31.4201,
    "lng": -64.1888,
    "informacion": "Centro comercial"
  },
  "lugares": [
    {
      "id": 1,
      "numero_lugar": "A1",
      "tipo": "estandar",
      "estado": "disponible"
    }
  ],
  "estadisticas": {
    "total": 50,
    "disponibles": 35,
    "ocupados": 10,
    "porcentaje_disponible": 70
  }
}
```

---

### 2. **Listar Lugares de Mi Estacionamiento**
```http
GET /api/employee/my-parking/spots
Authorization: Bearer <empleado_token>
```

---

### 3. **Actualizar Estado de Lugar** (Como empleado)
```http
PUT /api/employee/spots/:id/status
Authorization: Bearer <empleado_token>

{
  "estado": "ocupado"
}
```

---

### 4. **Crear Lugar en Mi Estacionamiento**
```http
POST /api/employee/spots
Authorization: Bearer <empleado_token>

{
  "estacionamiento_id": 1,
  "numero_lugar": "B5",
  "tipo": "estandar"
}
```

---

## 🔌 WEBSOCKET (Socket.io)

### Conexión
```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

socket.on('connect', () => {
  console.log('Conectado al servidor')
})
```

### Unirse a la sala de un estacionamiento
```javascript
socket.emit('join-parking', parkingId)
```

### Escuchar actualizaciones de lugares
```javascript
socket.on('spot-updated', (data) => {
  console.log('Lugar actualizado:', data)
  // {
  //   lugar_id: 1,
  //   estacionamiento_id: 1,
  //   estado: 'ocupado',
  //   numero_lugar: 'A1'
  // }
  
  // Actualizar el mapa o la grid en el frontend
  actualizarDisponibilidad(data)
})
```

### Salir de la sala
```javascript
socket.emit('leave-parking', parkingId)
```

---

## 🔒 ROLES Y PERMISOS

| Endpoint | Admin | Empleado | Cliente |
|----------|-------|----------|---------|
| POST /api/admin/parkings | ✅ | ❌ | ❌ |
| GET /api/client/parkings | ✅ | ✅ | ✅ |
| POST /api/admin/spots | ✅ | ✅ | ❌ |
| PUT /api/admin/spots/:id/status | ✅ | ✅ | ❌ |
| GET /api/employee/my-parking | ❌ | ✅ | ❌ |
| POST /api/admin/assign-employee | ✅ | ❌ | ❌ |

---

## 📋 FLUJO COMPLETO DE INTEGRACIÓN

### 1. **Admin registra estacionamiento**
```javascript
// Frontend Admin
const response = await fetch('http://localhost:4000/api/admin/parkings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_estacionamiento: 'Patio Olmos',
    latitud: -31.4201,
    longitud: -64.1888,
    informacion: 'Centro comercial'
  })
})
```

### 2. **Admin crea lugares para el estacionamiento**
```javascript
await fetch('http://localhost:4000/api/admin/spots/bulk', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    estacionamiento_id: 1,
    cantidad: 50,
    prefijo: 'A'
  })
})
```

### 3. **Admin registra empleado y lo asigna**
```javascript
// Registrar empleado
const emp = await fetch('http://localhost:4000/api/auth/register-employee', {
  method: 'POST',
  body: JSON.stringify({
    nombre: 'María',
    apellido: 'González',
    correo: 'maria@example.com',
    nombre_usuario: 'mariag',
    contrasena: '123456'
  })
})

// Asignar a estacionamiento
await fetch('http://localhost:4000/api/admin/assign-employee', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${adminToken}` },
  body: JSON.stringify({
    estacionamiento_id: 1,
    empleado_id: emp.id
  })
})
```

### 4. **Cliente ve estacionamiento en mapa**
```javascript
// Frontend Cliente - MapView.vue
const response = await fetch('http://localhost:4000/api/client/parkings')
const { estacionamientos } = await response.json()

// Mostrar en mapa con colores según disponibilidad
estacionamientos.forEach(parking => {
  const color = parking.disponibilidad.color // green, yellow, red
  addMarkerToMap(parking.lat, parking.lng, color)
})
```

### 5. **Empleado ocupa/libera lugares**
```javascript
// Frontend Empleado - ParkingGrid.vue
await fetch(`http://localhost:4000/api/employee/spots/${lugarId}/status`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${empleadoToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ estado: 'ocupado' })
})

// Esto emite Socket.io automáticamente ✨
```

### 6. **Cliente recibe actualización en tiempo real**
```javascript
// Frontend Cliente - MapView.vue (Socket.io)
socket.on('spot-updated', (data) => {
  // Actualizar disponibilidad del estacionamiento
  const parking = estacionamientos.find(p => p.id === data.estacionamiento_id)
  
  // Recalcular disponibilidad
  await actualizarDisponibilidad(parking.id)
  
  // Cambiar color del marcador si es necesario
  updateMarkerColor(parking.id, newColor)
})
```

---

## ✅ RESUMEN DE LO IMPLEMENTADO

### Backend:
- ✅ Modelo de Estacionamientos con lat/lng
- ✅ Modelo de Lugares con estados
- ✅ CRUD completo de estacionamientos
- ✅ CRUD completo de lugares
- ✅ Sistema de colores automático (verde/amarillo/rojo)
- ✅ Socket.io para actualizaciones en tiempo real
- ✅ Middleware de autenticación con roles
- ✅ Rutas protegidas según rol
- ✅ Registro de ocupaciones automático
- ✅ Asignación de empleados a estacionamientos

### Próximos pasos Frontend:
1. Formulario admin para crear estacionamientos
2. Formulario admin para registrar empleados
3. Conectar mapa cliente con API real
4. Integrar Socket.io en cliente
5. Dashboard empleado con datos reales
6. Guards de navegación en router

---

## 🧪 TESTING CON POSTMAN

Ver archivo: `GUIA_TESTEO_POSTMAN.md` para pruebas completas.
