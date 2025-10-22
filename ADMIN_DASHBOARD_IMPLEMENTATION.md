# 🎨 Admin Dashboard - SmartPark

## ✅ Implementación Completa del Dashboard de Administrador

Se ha adaptado completamente el prototipo de Admin Dashboard de React/TypeScript a Vue.js, manteniendo el diseño y funcionalidad original.

---

## 📁 Estructura de Archivos Creados

```
frontend/src/
├── views/
│   └── AdminDashboardView.vue          # Vista principal del dashboard
└── components/
    └── admin/
        ├── NavigationTabs.vue          # Navegación con tabs
        ├── ParkingDashboard.vue        # Dashboard de estacionamientos
        ├── ParkingCard.vue             # Tarjeta individual de estacionamiento
        ├── ParkingRegistrationForm.vue # Formulario de registro completo
        ├── ProfileView.vue             # Vista de perfil del admin
        └── SettingsView.vue            # Vista de configuración
```

---

## 🎯 Componentes Creados

### 1. **AdminDashboardView.vue** (Vista Principal)
- **Ubicación**: `frontend/src/views/AdminDashboardView.vue`
- **Función**: Contenedor principal que maneja:
  - Estado global del dashboard
  - Navegación entre tabs
  - Modal de registro de estacionamientos
  - Lista de estacionamientos
- **Características**:
  - Manejo de estado con `ref()`
  - Sistema de tabs (Perfil, Estacionamientos, Configuración)
  - Modal overlay para formulario de registro

### 2. **NavigationTabs.vue** (Navegación)
- **Ubicación**: `frontend/src/components/admin/NavigationTabs.vue`
- **Función**: Barra de navegación superior
- **Tabs**:
  - 👤 Mi Perfil
  - 🚗 Estacionamientos
  - ⚙️ Configuración
- **Estilo**: Gradiente azul-verde con iconos de Lucide

### 3. **ParkingDashboard.vue** (Dashboard Principal)
- **Ubicación**: `frontend/src/components/admin/ParkingDashboard.vue`
- **Función**: Vista principal de estacionamientos
- **Características**:
  - Botón destacado "Registrar un Estacionamiento"
  - Grid responsive de tarjetas de estacionamiento
  - Estado vacío con mensaje motivacional
  - Estadísticas rápidas:
    - Total de estacionamientos
    - Plazas totales
    - Promedio por estacionamiento

### 4. **ParkingCard.vue** (Tarjeta de Estacionamiento)
- **Ubicación**: `frontend/src/components/admin/ParkingCard.vue`
- **Función**: Tarjeta individual para cada estacionamiento
- **Características**:
  - Imagen del estacionamiento
  - Badge de ocupación (%)
  - Nombre y ubicación
  - Plazas totales y disponibles
  - Efecto hover con escala y sombra
  - Click para ver detalles

### 5. **ParkingRegistrationForm.vue** (Formulario de Registro)
- **Ubicación**: `frontend/src/components/admin/ParkingRegistrationForm.vue`
- **Función**: Formulario completo para registrar estacionamientos
- **Secciones**:

#### 📋 **Información Básica**
- Nombre del estacionamiento
- Matrícula
- Ubicación (textarea)
- Cantidad de plazas

#### 🖼️ **Imágenes**
- Upload múltiple de imágenes
- Preview con opción de eliminar
- Mínimo 3 imágenes requeridas
- Máximo 5 imágenes

#### 💰 **Tarifas**
- Tarifa para motos (por hora)
- Tarifa para autos (por hora)
- Inputs con símbolo $ decorativo

#### 👥 **Empleados**
**IMPORTANTE**: Los empleados se registran como usuarios completos con todos los campos del modelo `Usuario`:

##### Datos Personales (modelo Usuario):
- **Nombre** (requerido)
- **Apellido** (requerido)
- **DNI** (requerido)
- **Teléfono** (requerido)
- **Email/Correo** (requerido)
- **Dirección** (opcional)

##### Credenciales de Acceso:
- **Nombre de Usuario** (requerido)
- **Contraseña** (requerido, con toggle de visibilidad)

##### Funcionalidad:
- ➕ Botón "Agregar Empleado"
- 🗑️ Botón para eliminar empleado individual
- 👁️ Toggle para mostrar/ocultar contraseña
- Cada empleado tendrá `rol_empleado = true` en la BD

---

## 6. **ProfileView.vue** (Perfil del Administrador)
- **Ubicación**: `frontend/src/components/admin/ProfileView.vue`
- **Función**: Vista del perfil del administrador
- **Características**:
  - Avatar con iniciales
  - Información personal del usuario
  - Estado de la cuenta (badge)
  - Badge de rol "Administrador"
  - Estadísticas:
    - Estacionamientos totales
    - Empleados totales
    - Plazas totales
  - Botón "Editar Perfil" (pendiente implementar)

### 7. **SettingsView.vue** (Configuración)
- **Ubicación**: `frontend/src/components/admin/SettingsView.vue`
- **Función**: Configuración de la cuenta
- **Secciones**:
  - 🔒 **Seguridad**: Cambio de contraseña
  - 🔔 **Notificaciones**: 
    - Email
    - Alertas de ocupación
    - Resumen diario
  - 🌍 **Preferencias**:
    - Idioma (ES, EN, PT)
    - Zona horaria
  - ⚠️ **Zona Peligrosa**:
    - Cerrar sesión
    - Eliminar cuenta

---

## 🛣️ Rutas Configuradas

### Router actualizado (`frontend/src/router/index.js`):
```javascript
{
  path: '/admin/dashboard',
  name: 'admin-dashboard',
  component: AdminDashboardView,
  meta: { requiresAuth: true, role: 'admin' }
}
```

---

## 🔐 Autenticación y Redirección

### Login actualizado (`AdminLogin.vue`):
```javascript
// Al hacer login exitoso:
if (data.usuario.rol && data.usuario.rol.rol_administrador) {
  router.push('/admin/dashboard') // ✅ Redirige al dashboard
} else {
  alert('No tienes permisos de administrador')
}
```

---

## 🎨 Diseño y Estilo

### Paleta de Colores:
- **Primario**: Gradiente azul-verde (`from-blue-600 to-green-600`)
- **Background**: Gradiente suave (`from-blue-50 via-green-50 to-blue-50`)
- **Tarjetas**: Blanco con bordes verdes
- **Hover**: Escala, sombra y cambio de color

### Componentes UI Utilizados:
- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Card / CardHeader / CardContent
- ✅ Checkbox
- ✅ Lucide Icons (Plus, Trash2, Upload, Eye, EyeOff, User, Car, Settings, etc.)

---

## 📊 Flujo de Uso

### 1. **Login del Administrador**
```
1. Admin va a /admin/login
2. Ingresa credenciales
3. Backend valida y devuelve token + datos de usuario
4. Frontend guarda en localStorage
5. Verifica que tenga rol_administrador = true
6. Redirige a /admin/dashboard ✅
```

### 2. **Dashboard Principal**
```
1. Admin ve el dashboard vacío (sin estacionamientos)
2. Hace clic en "Registrar un Estacionamiento"
3. Se abre modal con formulario completo
```

### 3. **Registro de Estacionamiento**
```
1. Completa información básica
2. Sube mínimo 3 imágenes
3. Define tarifas para moto y auto
4. Agrega empleados (con TODOS los datos de Usuario)
   - Nombre, apellido, DNI, teléfono, email, dirección
   - Nombre de usuario y contraseña
5. Submit → Se enviará al backend (pendiente controller)
6. Backend creará:
   - Registro en tabla Estacionamientos
   - Registros en tabla Usuarios (para cada empleado)
   - Registros en tabla Roles (rol_empleado = true)
```

---

## 🔄 Integración con Backend (Pendiente)

### Endpoint a Crear: `POST /api/admin/parkings`

**Request Body:**
```json
{
  "name": "Estacionamiento Centro",
  "location": "Av. Corrientes 1234",
  "spaces": 50,
  "license": "EST-2024-001",
  "images": ["url1", "url2", "url3"],
  "rates": {
    "moto": 150.00,
    "auto": 300.00
  },
  "employees": [
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "nombre_usuario": "juanp",
      "correo": "juan@email.com",
      "contrasena": "password123",
      "telefono": "1234567890",
      "dni": "12345678",
      "direccion": "Calle Falsa 123"
    }
  ]
}
```

**Lógica del Backend:**
1. Validar que el usuario tenga `rol_administrador = true`
2. Crear registro en tabla `Estacionamientos`
3. Para cada empleado:
   - Crear en tabla `Usuarios` con hash de contraseña
   - Crear en tabla `Roles` con `rol_empleado = true`
   - Asociar al estacionamiento
4. Guardar imágenes (si es necesario)
5. Retornar estacionamiento creado

---

## 🎯 Características Implementadas

### ✅ Completadas:
- [x] Navegación con tabs funcional
- [x] Dashboard de estacionamientos responsive
- [x] Tarjetas de estacionamiento con diseño del prototipo
- [x] Formulario de registro completo
- [x] Empleados con TODOS los campos del modelo Usuario
- [x] Upload de imágenes con preview
- [x] Vista de perfil con datos del localStorage
- [x] Vista de configuración con múltiples secciones
- [x] Redirección automática después del login
- [x] Validación de rol de administrador
- [x] Modal overlay para formulario
- [x] Estadísticas en tiempo real
- [x] Estado vacío con mensaje motivacional

### 🔨 Pendientes (Backend):
- [ ] Controller de administrador (`adminController.js`)
- [ ] Endpoint `POST /api/admin/parkings`
- [ ] Modelo de Estacionamiento
- [ ] Relación Estacionamiento-Empleado
- [ ] Upload real de imágenes al servidor
- [ ] Endpoints de gestión de empleados
- [ ] Endpoints de edición/eliminación de estacionamientos

---

## 🧪 Testing del Dashboard

### Cómo Probar:
1. Registra un administrador en `/admin/register`
2. Verifica tu email
3. Inicia sesión en `/admin/login`
4. Deberías ser redirigido automáticamente a `/admin/dashboard`
5. Verás el dashboard vacío
6. Haz clic en "Registrar un Estacionamiento"
7. Completa el formulario:
   - Información básica
   - Sube 3+ imágenes
   - Define tarifas
   - Agrega al menos 1 empleado con TODOS sus datos
8. Envía el formulario
9. Por ahora se agregará localmente (sin persistencia)
10. Navega entre tabs: Perfil, Estacionamientos, Configuración

---

## 📝 Notas Importantes

### Sobre los Empleados:
- Los empleados NO son solo "usuarios del sistema"
- Son entidades completas del modelo `Usuario`
- Deben tener TODOS los campos:
  - Datos personales (nombre, apellido, DNI, teléfono, email, dirección)
  - Credenciales (nombre_usuario, contraseña)
- Se les asignará `rol_empleado = true` en la tabla `Roles`
- La contraseña se hasheará en el backend antes de guardar

### Sobre las Imágenes:
- Por ahora se usan URLs de datos (Data URLs) temporales
- En producción necesitarás:
  - Endpoint de upload de imágenes
  - Storage (S3, Cloudinary, local, etc.)
  - Validación de tipos de archivo
  - Compresión de imágenes

---

## 🚀 Próximos Pasos

1. **Implementar el Backend**:
   - Crear modelo `Estacionamiento`
   - Crear controller `adminController.js`
   - Endpoints de CRUD de estacionamientos
   - Sistema de upload de imágenes

2. **Mejorar el Frontend**:
   - Vista detallada de cada estacionamiento
   - Edición de estacionamientos
   - Gestión de empleados
   - Dashboards con gráficos
   - Filtros y búsqueda

3. **Funcionalidades Avanzadas**:
   - Reportes de ocupación
   - Gestión de pagos
   - Notificaciones en tiempo real
   - Analytics y métricas

---

¡El Admin Dashboard está completamente adaptado y listo para usar! 🎉
