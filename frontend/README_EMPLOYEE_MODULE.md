# 👷 Módulo de Empleado - Frontend Vue.js

## 📍 Ubicación

Este módulo está integrado en el **frontend principal** del proyecto (Vue.js), **NO** uses el prototipo React separado.

```
frontend/
├── src/
│   ├── components/
│   │   ├── EmployeeLogin.vue           ← Login de empleado
│   │   └── employee/                    ← Componentes del módulo
│   │       ├── ParkingGrid.vue         ← Grid de espacios
│   │       ├── ReservationValidator.vue ← Validador de códigos
│   │       └── PendingReservations.vue  ← Lista de reservas
│   ├── views/
│   │   ├── EmployeeLoginView.vue       ← Vista de login
│   │   └── EmployeeDashboardView.vue   ← Vista principal
│   ├── services/
│   │   └── employeeService.js          ← Servicios API
│   └── router/
│       └── index.js                    ← Rutas configuradas
```

## 🚀 Acceso

### Desde la Home

1. Inicia el frontend: `npm run dev`
2. Abre: http://localhost:8080
3. En la home, verás **3 tarjetas**:
   - 🔴 Administración
   - 🟢 **Empleados** ← Aquí
   - 🔵 Clientes

### Rutas Disponibles

- **Login**: `/employee/login`
- **Dashboard**: `/employee/dashboard`

## 👤 Usuarios de Prueba

| Usuario | Contraseña | Nombre |
|---------|-----------|---------|
| `emp001` | `123456` | Carlos Rodríguez |
| `emp002` | `123456` | María García |

## 🎯 Funcionalidades

### ✅ Implementadas

1. **Login de Empleados**
   - Formulario de autenticación
   - Validación de credenciales
   - Almacenamiento de sesión

2. **Grid de Estacionamiento**
   - 50 espacios interactivos (A01-A50)
   - Estados: Libre (verde), Ocupado (rojo), Reservado (amarillo)
   - Click para cambiar estado
   - Filtros por estado
   - Botón reiniciar todos

3. **Validación de Reservas**
   - Por código numérico (4 dígitos)
   - Simulación de escaneo QR
   - Muestra datos del cliente
   - Códigos válidos: `4567`, `8901`, `2345`

4. **Reservas Pendientes**
   - Lista de 3 reservas de prueba
   - Asignación de lugares disponibles
   - Modal de confirmación
   - Actualización automática

5. **Estadísticas**
   - Espacios libres/ocupados/reservados
   - Reservas pendientes
   - Actualización en tiempo real

6. **Sesión**
   - Temporizador de trabajo
   - Logout con limpieza

## 📊 Datos Mock

### Espacios (50)
```javascript
{
  id: 1-50,
  numero_lugar: 'A01' a 'A50',
  estado: 'disponible' | 'ocupado' | 'reservado',
  estacionamiento_id: 1
}
```

### Reservas (3)
```javascript
{
  id: 1-3,
  codigo_numerico: '4567' | '8901' | '2345',
  usuario: { nombre, email },
  vehiculo: { placa, modelo, color }
}
```

## 🔌 Conexión con Backend

### Actual: Mock Data
```javascript
// frontend/src/services/employeeService.js
const USE_MOCK_DATA = true; // Datos de prueba
```

### Para Conectar Backend:
1. Asegúrate que el backend esté corriendo en `http://localhost:3000`
2. Edita `frontend/src/services/employeeService.js`:
   ```javascript
   const USE_MOCK_DATA = false; // Cambiar a false
   ```

### O usa Variables de Entorno:
```env
# frontend/.env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=false
```

## 🎮 Cómo Usar

### 1. Iniciar Sesión
```
1. Ve a http://localhost:8080
2. Click en tarjeta "Empleados" (verde)
3. Usuario: emp001
4. Contraseña: 123456
5. Click "Iniciar Sesión"
```

### 2. Gestionar Espacios
```
Tab "Estacionamiento":
- Ver grid con 50 espacios
- Click en espacio para cambiar estado
- Usar filtros para buscar
- Botón "Reiniciar Todo" para limpiar
```

### 3. Validar Reserva
```
Tab "Validar Reserva":
- Ingresa código: 4567
- O click "Simular Escaneo QR"
- Ve los datos del cliente
```

### 4. Asignar Lugares
```
Tab "Reservas Pendientes":
- Ve la lista de 3 reservas
- Click "Asignar Espacio"
- Selecciona lugar disponible
- Confirma
```

### 5. Ver Estadísticas
```
Tab "Estadísticas":
- Espacios libres: verde
- Espacios ocupados: rojo
- Espacios reservados: amarillo
- Reservas pendientes: azul
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│  HomeView.vue (/)                       │
│  3 opciones: Admin | Empleado | Cliente │
└─────────────────────────────────────────┘
                 │
                 ↓ (Click "Empleados")
┌─────────────────────────────────────────┐
│  EmployeeLoginView.vue                  │
│  /employee/login                        │
│                                         │
│  ├─ EmployeeLogin.vue                  │
│  └─ employeeService.loginEmployee()    │
└─────────────────────────────────────────┘
                 │
                 ↓ (Login exitoso)
┌─────────────────────────────────────────┐
│  EmployeeDashboardView.vue              │
│  /employee/dashboard                    │
│                                         │
│  ├─ Tab: Estacionamiento                │
│  │   └─ ParkingGrid.vue                │
│  │                                      │
│  ├─ Tab: Validar Reserva               │
│  │   └─ ReservationValidator.vue       │
│  │                                      │
│  ├─ Tab: Reservas Pendientes           │
│  │   └─ PendingReservations.vue        │
│  │                                      │
│  └─ Tab: Estadísticas                  │
│      └─ Cards con métricas             │
└─────────────────────────────────────────┘
```

## 🔧 Servicios API

Todas las funciones en `frontend/src/services/employeeService.js`:

```javascript
// Autenticación
loginEmployee(username, password)

// Lugares
getPlaces(estacionamientoId)
updatePlaceStatus(lugarId, nuevoEstado)

// Reservas
getPendingReservations()
validateReservation(code)
assignPlaceToReservation(reservaId, lugarId)

// Estadísticas
getDailyStats()
```

Cada función tiene:
- ✅ Implementación mock (funcionando)
- ✅ Implementación backend (lista)
- ✅ Manejo de errores

## 📱 Responsive

- ✅ Mobile: Grid de 2-4 columnas
- ✅ Tablet: Grid de 5-8 columnas
- ✅ Desktop: Grid de 10 columnas

## 🎨 Estilos

Usa **Tailwind CSS** del frontend principal:
- Verde: Libre (`bg-green-50`, `border-green-500`)
- Rojo: Ocupado (`bg-red-50`, `border-red-500`)
- Amarillo: Reservado (`bg-yellow-50`, `border-yellow-500`)

## ⚡ Comandos

```bash
# Desde la raíz de frontend/
cd frontend

# Instalar dependencias (si no lo hiciste)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🐛 Solución de Problemas

### No aparece la tarjeta de Empleados en Home
- Verifica que guardaste los cambios en `HomeView.vue`
- Recarga el navegador

### Error al hacer login
- Verifica que `employeeService.js` existe
- Revisa la consola del navegador

### No carga los espacios
- Mock data está en `employeeService.js`
- Verifica que `USE_MOCK_DATA = true`

## 📝 Diferencias con el Prototipo React

| Aspecto | Prototipo React | Frontend Vue |
|---------|----------------|--------------|
| **Ubicación** | `Employee Dashboard Module/` | `frontend/src/` |
| **Tecnología** | React + TypeScript | Vue 3 + JS |
| **Estilos** | shadcn/ui | Tailwind CSS |
| **Componentes** | `.tsx` | `.vue` |
| **Estado** | useState, useEffect | data, computed |
| **Routing** | Independiente | Integrado con router |
| **Uso** | **NO USAR** | **USAR ESTE** |

## ✨ Ventajas de Esta Implementación

1. **Integrado** - Todo en un solo proyecto
2. **Consistente** - Misma tecnología que admin/cliente
3. **Centralizado** - Una sola configuración
4. **Mantenible** - Código Vue estándar
5. **Escalable** - Fácil agregar features

## 🎯 Próximos Pasos

1. ✅ **Probar** - Inicia y prueba todas las funciones
2. ✅ **Personalizar** - Ajusta según necesites
3. 🔄 **Backend** - Conecta cuando esté listo
4. 🔄 **Mejorar** - Agrega más features

## 📞 Notas Importantes

- ❌ **NO uses** `Employee Dashboard Module/` (prototipo React)
- ✅ **USA** `frontend/src/` (este módulo Vue)
- ✅ Los datos mock están dentro del servicio
- ✅ El módulo está integrado con el frontend principal
- ✅ Usa las mismas rutas que admin y cliente

## 🔗 Rutas del Sistema

```
/                         → Home (3 opciones)
/admin/login             → Login Admin
/client/login            → Login Cliente
/employee/login          → Login Empleado ← TU MÓDULO
/employee/dashboard      → Dashboard Empleado ← TU MÓDULO
```

---

**Estado**: ✅ Listo para usar  
**Ubicación**: `frontend/src/`  
**Tecnología**: Vue 3 + Tailwind CSS  
**Mock Data**: ✅ Integrado  
**Backend Ready**: ✅ Preparado

¡Usa ESTE módulo, está integrado en tu frontend Vue! 🎉
