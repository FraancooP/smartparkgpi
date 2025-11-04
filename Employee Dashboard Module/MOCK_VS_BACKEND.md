# 🔄 Transición de Mock Data a Backend Real

## 📊 Estado Actual vs Futuro

| Aspecto | 🟡 Ahora (Mock) | 🟢 Futuro (Backend) |
|---------|----------------|-------------------|
| **Autenticación** | Usuarios locales hardcoded | JWT desde backend |
| **Espacios** | 50 espacios generados aleatoriamente | Cargados desde BD |
| **Reservas** | 3 reservas fijas de prueba | Reservas reales de clientes |
| **Estados** | Cambios solo en localStorage | Persistidos en BD |
| **Tiempo real** | Simulado con timers locales | WebSockets o polling |
| **Validación** | Códigos hardcoded | Validación real contra BD |

---

## 🔧 Cómo Funciona Ahora (Mock Data)

### Flujo Actual
```
Usuario → LoginForm → employeeService.js
                            ↓
                      ¿useMockData?
                            ↓ (true)
                      mockData.js
                            ↓
                      Datos locales
                            ↓
                      UI se actualiza
```

### Datos Mock Disponibles

#### 1. Empleados (2 usuarios)
```javascript
mockEmployees = {
  'emp001': {
    id: 1,
    nombre: 'Carlos Rodríguez',
    email: 'carlos@smartpark.com',
    username: 'emp001',
    password: '123456',
    rol_id: 3,
    estacionamiento_asignado: 1
  },
  'emp002': { ... }
}
```

#### 2. Lugares (50 espacios)
```javascript
mockLugares = [
  {
    id: 1,
    numero_lugar: 'A01',
    tipo: 'estandar',
    estado: 'disponible', // o 'ocupado', 'reservado'
    estacionamiento_id: 1
  },
  // ... 49 más
]
```

#### 3. Reservas (3 pendientes)
```javascript
mockReservas = [
  {
    id: 1,
    codigo_numerico: '4567',
    estado: 'pendiente',
    usuario: { nombre: 'Juan Pérez' },
    vehiculo: { placa: 'ABC-123' }
  },
  // ... 2 más
]
```

---

## 🔌 Cómo Funcionará con Backend

### Flujo Futuro
```
Usuario → LoginForm → employeeService.js
                            ↓
                      ¿useMockData?
                            ↓ (false)
                      fetch(backend_url)
                            ↓
                      Backend API
                            ↓
                      Base de Datos MySQL
                            ↓
                      Datos reales
                            ↓
                      UI se actualiza
```

---

## 🎯 Cambios Necesarios para Conectar Backend

### Paso 1: Configurar URL del Backend

**Archivo**: `src/config/api.js`

```javascript
// ANTES (Mock)
const API_CONFIG = {
  baseURL: 'http://localhost:3000',
  useMockData: true  // ← Cambiar esto
};

// DESPUÉS (Backend Real)
const API_CONFIG = {
  baseURL: 'http://localhost:3000',  // o tu URL de backend
  useMockData: false  // ← Aquí está el cambio
};
```

### Paso 2: Verificar que el Backend Esté Corriendo

```powershell
# En otra terminal, en la carpeta backend/
cd ..\backend
npm run dev

# Deberías ver:
# Server running on port 3000
```

### Paso 3: Verificar Endpoints Disponibles

El backend debe tener estos endpoints implementados:

```javascript
// Autenticación
POST   /api/auth/login
Body: { username: string, password: string }
Response: { success: true, data: { token, employee } }

// Lugares
GET    /api/lugares?estacionamiento_id=1
Response: { success: true, data: [{ id, numero_lugar, estado, ... }] }

PATCH  /api/lugares/:id/estado
Body: { estado: 'disponible' | 'ocupado' | 'reservado' }
Response: { success: true, data: { lugarActualizado } }

// Reservas
GET    /api/reservas?estado=pendiente
Response: { success: true, data: [{ id, codigo_numerico, usuario, ... }] }

GET    /api/reservas/codigo/:code
Response: { success: true, data: { valid: true, reservation: {...} } }

POST   /api/reservas/:id/validar
Body: { lugar_id: number }
Response: { success: true, data: { reserva, lugar } }

// Ocupaciones
POST   /api/ocupaciones
Body: { lugar_id, usuario_id, vehiculo_id }
Response: { success: true, data: { nuevaOcupacion } }

POST   /api/ocupaciones/:id/finalizar
Response: { success: true, data: { ocupacionFinalizada, costo } }

// Estadísticas
GET    /api/estadisticas/empleado
Response: { success: true, data: { total_lugares, disponibles, ... } }
```

---

## 🔍 Comparación de Respuestas

### Login

#### Mock Data
```javascript
{
  success: true,
  data: {
    token: 'mock-jwt-token-1699999999',
    employee: {
      id: 1,
      nombre: 'Carlos Rodríguez',
      email: 'carlos@smartpark.com',
      username: 'emp001',
      rol_id: 3,
      estacionamiento_asignado: 1
    }
  }
}
```

#### Backend Real (Esperado)
```javascript
{
  success: true,
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    employee: {
      id: 1,
      nombre: 'Carlos Rodríguez',
      email: 'carlos@smartpark.com',
      rol_id: 3,
      estacionamiento_asignado: 1,
      verificado: true,
      creado_en: '2025-11-01T00:00:00.000Z'
    }
  }
}
```

---

## ⚙️ Servicios ya Preparados

Todos los servicios en `employeeService.js` ya tienen:

1. **Versión Mock** (funcionando ahora)
2. **Versión Backend** (lista para usar)

### Ejemplo: getPlaces()

```javascript
export const getPlaces = async (estacionamientoId) => {
  // SI useMockData = true (AHORA)
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(300);
    return mockSuccessResponse(mockLugares);
  }

  // SI useMockData = false (FUTURO)
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/api/lugares?estacionamiento_id=${estacionamientoId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al obtener los lugares');
  }
};
```

**¡Solo cambiando `useMockData` el sistema se adapta!**

---

## 🧪 Proceso de Migración

### Fase 1: Mock Data (ACTUAL) ✅
```
✅ Frontend funcionando
✅ UI completa
✅ Flujos testeados
✅ Datos de prueba
```

### Fase 2: Backend Preparado (PRÓXIMO)
```
⬜ Backend endpoints creados
⬜ Modelos de BD coinciden
⬜ JWT implementado
⬜ CORS configurado
```

### Fase 3: Integración (FUTURO)
```
⬜ Cambiar useMockData: false
⬜ Probar login real
⬜ Probar operaciones CRUD
⬜ Ajustar errores si hay
```

### Fase 4: Producción (META)
```
⬜ Tests end-to-end
⬜ Manejo de errores robusto
⬜ Optimizaciones
⬜ Deploy
```

---

## 🔐 Autenticación: Mock vs Real

### Mock (Ahora)
```javascript
// Login local sin encriptación
const employee = mockEmployees[username];
if (employee.password === password) {
  return mockSuccessResponse({
    token: 'mock-jwt-token',
    employee: employeeData
  });
}
```

### Real (Futuro)
```javascript
// Login con backend
POST /api/auth/login
{
  username: 'emp001',
  password: '123456'  // Se enviará encriptada en HTTPS
}

// Backend valida con bcrypt
// Retorna JWT real
{
  token: 'eyJhbGciOi...',  // Token JWT firmado
  employee: { ... }
}
```

---

## 📊 Persistencia de Datos

### Mock (Ahora)
```
Login → localStorage
Cambios → Arrays en memoria
Recarga → Se pierden cambios
```

### Real (Futuro)
```
Login → localStorage (token) + Backend (sesión)
Cambios → Base de datos MySQL
Recarga → Datos persisten
```

---

## 🚀 Ventajas de Esta Arquitectura

### ✅ Desarrollo Paralelo
- Frontend avanza sin esperar backend
- Backend se desarrolla independientemente
- Fácil testing de UI

### ✅ Migración Suave
- Un solo cambio de configuración
- No reescribir código
- Fallback automático si backend falla

### ✅ Testing Flexible
```javascript
// Pruebas locales
useMockData: true

// Pruebas con backend
useMockData: false

// Pruebas mixtas
useMockData: process.env.NODE_ENV === 'development'
```

---

## 📝 Checklist de Integración

Cuando vayas a conectar con el backend real:

### Pre-integración
- [ ] Backend corriendo en puerto 3000
- [ ] Todos los endpoints implementados
- [ ] Modelos coinciden con mock data
- [ ] CORS habilitado para frontend
- [ ] JWT implementado y funcionando

### Integración
- [ ] Cambiar `useMockData: false`
- [ ] Actualizar `baseURL` si es necesario
- [ ] Probar login con usuario real
- [ ] Verificar que el token se guarde
- [ ] Probar carga de lugares
- [ ] Probar carga de reservas

### Post-integración
- [ ] Todos los flujos funcionando
- [ ] Manejo de errores robusto
- [ ] Loading states apropiados
- [ ] Mensajes de error claros
- [ ] Performance aceptable

---

## 💡 Tips Importantes

1. **No borres mockData.js**
   - Útil para desarrollo local
   - Bueno para demos
   - Necesario para tests

2. **Mantén ambas versiones**
   ```javascript
   if (API_CONFIG.useMockData) {
     // versión mock
   } else {
     // versión backend
   }
   ```

3. **Agrega logs de desarrollo**
   ```javascript
   if (process.env.VITE_DEBUG === 'true') {
     console.log('API Response:', response);
   }
   ```

4. **Maneja errores de red**
   ```javascript
   try {
     const response = await fetch(...);
     return await response.json();
   } catch (error) {
     console.error('Network error:', error);
     // Fallback a mock si falla
     if (API_CONFIG.fallbackToMock) {
       return mockData;
     }
   }
   ```

---

## 🎯 Resumen

```
┌─────────────────────────────────────────┐
│  AHORA (Mock Data)                      │
├─────────────────────────────────────────┤
│  ✅ 100% funcional                      │
│  ✅ No requiere backend                 │
│  ✅ Perfecto para desarrollo            │
│  ✅ Fácil de testear                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  FUTURO (Backend Real)                  │
├─────────────────────────────────────────┤
│  🔄 Un cambio de configuración          │
│  🔄 Misma interfaz, datos reales        │
│  🔄 Persistencia en BD                  │
│  🔄 Múltiples usuarios simultáneos      │
└─────────────────────────────────────────┘
```

**¡El módulo está listo para ambos escenarios!** 🎉

---

**Última actualización**: Noviembre 2025
