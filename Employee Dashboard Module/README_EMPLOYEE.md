# 👷 Módulo de Empleado - SmartPark

## 📋 Descripción

Este es el módulo de **Dashboard de Empleados** para el sistema SmartPark. Permite a los empleados gestionar los espacios de estacionamiento, validar reservas y controlar las ocupaciones en tiempo real.

## 🎯 Características Principales

### ✅ Implementado (Con datos de prueba)
- **Login de Empleados**: Autenticación con usuario y contraseña
- **Vista de Estacionamiento**: Grid interactivo con todos los espacios
- **Estados de Espacios**: Libre, Ocupado, Reservado
- **Validación de Reservas**: Por código numérico o QR
- **Gestión de Reservas Pendientes**: Lista y asignación de espacios
- **Estadísticas en Tiempo Real**: Resumen de espacios disponibles/ocupados
- **Temporizador de Sesión**: Control del tiempo de trabajo
- **Filtros**: Por estado de espacios

### 🔄 Preparado para Backend
- Estructura de servicios lista para conectar con API
- Datos mock que simulan la estructura del backend
- Sistema de fallback: usa mock data si el backend no está disponible

## 📁 Estructura del Proyecto

```
Employee Dashboard Module/
├── src/
│   ├── components/           # Componentes React
│   │   ├── Dashboard.tsx     # Panel principal del empleado
│   │   ├── LoginForm.tsx     # Formulario de login
│   │   ├── ParkingGrid.tsx   # Grid de espacios
│   │   ├── ParkingSpot.tsx   # Componente individual de espacio
│   │   ├── PendingReservations.tsx  # Lista de reservas
│   │   ├── ReservationValidator.tsx # Validador de códigos
│   │   ├── SessionTimer.tsx  # Temporizador de sesión
│   │   └── ui/              # Componentes de UI (shadcn)
│   ├── services/            # Servicios de API
│   │   ├── employeeService.js  # Funciones para backend
│   │   └── mockData.js        # Datos de prueba
│   ├── config/
│   │   └── api.js           # Configuración de la API
│   ├── App.tsx              # Componente raíz
│   └── main.tsx             # Entry point
├── package.json
└── vite.config.ts
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```powershell
cd "Employee Dashboard Module"
npm install
```

### 2. Configurar Variables de Entorno (Opcional)

Crea un archivo `.env` en la raíz del módulo:

```env
# URL del backend (cuando esté listo)
VITE_API_URL=http://localhost:3000

# Usar datos mock (true) o conectar con backend (false)
VITE_USE_MOCK=true
```

### 3. Iniciar el Servidor de Desarrollo

```powershell
npm run dev
```

El módulo estará disponible en: `http://localhost:5173`

## 👤 Usuarios de Prueba

Para probar el sistema, usa estas credenciales:

| Usuario | Contraseña | Nombre |
|---------|-----------|---------|
| `emp001` | `123456` | Carlos Rodríguez |
| `emp002` | `123456` | María García |

## 🎮 Cómo Usar el Sistema

### 1. Login
- Ingresa con uno de los usuarios de prueba
- El sistema guarda la sesión en localStorage

### 2. Vista de Estacionamiento
- **Click en un espacio** para cambiar su estado:
  - Libre → Ocupado
  - Ocupado → Libre
  - Reservado → Ocupado
- **Filtrar** espacios por estado
- **Reiniciar Todo** para limpiar el grid

### 3. Validar Reserva
- **Código Numérico**: Ingresa el código (ej: 4567, 8901, 2345)
- **Código QR**: Simula el escaneo de un QR
- Muestra información del cliente y vehículo

### 4. Reservas Pendientes
- Lista de reservas que necesitan asignación
- **Asignar Espacio**: Selecciona un lugar disponible
- El sistema actualiza automáticamente el estado

### 5. Estadísticas
- Resumen en tiempo real de:
  - Espacios libres
  - Espacios ocupados
  - Espacios reservados
  - Reservas pendientes

## 🔌 Conexión con Backend

### Estructura de Datos Esperada del Backend

#### Login Empleado
```javascript
// POST /api/auth/login
Request: { username: string, password: string }

Response: {
  success: true,
  data: {
    token: string,
    employee: {
      id: number,
      nombre: string,
      email: string,
      rol_id: number,
      estacionamiento_asignado: number
    }
  }
}
```

#### Obtener Lugares
```javascript
// GET /api/lugares?estacionamiento_id=1
Response: {
  success: true,
  data: [{
    id: number,
    numero_lugar: string,
    tipo: 'estandar' | 'discapacitado' | 'electrico' | 'moto',
    estado: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento',
    estacionamiento_id: number
  }]
}
```

#### Obtener Reservas Pendientes
```javascript
// GET /api/reservas?estado=pendiente
Response: {
  success: true,
  data: [{
    id: number,
    codigo_numerico: string,
    codigo_qr: string,
    fecha: string,
    hora: string,
    usuario: { nombre: string, email: string },
    vehiculo: { placa: string, modelo: string, color: string }
  }]
}
```

### Para Conectar con el Backend Real

1. **Cambia la configuración** en `src/config/api.js`:
```javascript
useMockData: false,  // Cambiar a false
```

2. **Asegúrate** de que el backend esté corriendo en `http://localhost:3000`

3. **Implementa los endpoints** en el backend según las estructuras documentadas

## 🔧 Servicios Disponibles

Todos los servicios están en `src/services/employeeService.js`:

- `loginEmployee(username, password)` - Autenticación
- `getPlaces(estacionamientoId)` - Obtener lugares
- `updatePlaceStatus(lugarId, nuevoEstado)` - Actualizar estado
- `getPendingReservations()` - Reservas pendientes
- `validateReservation(code)` - Validar código
- `assignPlaceToReservation(reservaId, lugarId)` - Asignar lugar
- `createOccupation(data)` - Crear ocupación
- `endOccupation(ocupacionId)` - Finalizar ocupación
- `getDailyStats()` - Estadísticas del día

## 📊 Datos Mock (Para Pruebas)

El archivo `src/services/mockData.js` contiene:
- 2 empleados de prueba
- 50 espacios de estacionamiento
- 3 reservas pendientes
- 2 ocupaciones activas

**Códigos válidos para pruebas**: `4567`, `8901`, `2345`

## 🎨 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **shadcn/ui** componentes de UI
- **Lucide React** para iconos
- **Radix UI** para componentes accesibles

## 📝 Próximos Pasos

1. **Conectar con el backend** cuando los endpoints estén listos
2. **Implementar WebSockets** para actualizaciones en tiempo real
3. **Agregar notificaciones** para reservas próximas
4. **Mejorar el validador QR** con una librería real
5. **Agregar reportes** exportables (PDF, Excel)
6. **Implementar modo offline** con sincronización

## 🐛 Notas Importantes

- Los **errores de TypeScript** son normales hasta instalar todas las dependencias
- El sistema usa **localStorage** para mantener la sesión
- Los **datos mock** se reinician al recargar la página
- Los **temporizadores** funcionan con la hora del cliente

## 📞 Soporte

Si tienes problemas con el módulo:
1. Verifica que todas las dependencias estén instaladas
2. Revisa la configuración en `config/api.js`
3. Mira la consola del navegador para errores
4. Asegúrate de que el backend esté corriendo (si no usas mock)

---

**Autor**: Módulo desarrollado para SmartPark  
**Última actualización**: Noviembre 2025
