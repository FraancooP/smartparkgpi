# 🚀 Guía Rápida - Módulo de Empleado

## Instalación Rápida

```powershell
# 1. Navegar al módulo
cd "Employee Dashboard Module"

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 🎯 Acceso Rápido

**URL**: http://localhost:5173

**Usuarios de Prueba**:
- Usuario: `emp001` | Contraseña: `123456`
- Usuario: `emp002` | Contraseña: `123456`

## ✅ Funcionalidades Listas para Usar

### 1️⃣ Login
- Ingresa con las credenciales de prueba
- Se guardará la sesión automáticamente

### 2️⃣ Gestión de Espacios
- **50 espacios** creados automáticamente (A01-A50)
- **Click** en un espacio para cambiar su estado
- **Filtros** para ver solo libres, ocupados o reservados
- **Botón "Reiniciar Todo"** para limpiar y volver a empezar

### 3️⃣ Validar Reservas
- **Códigos válidos**: `4567`, `8901`, `2345`
- Ingresa el código y presiona "Validar"
- También puedes simular escaneo QR

### 4️⃣ Reservas Pendientes
- Hay **3 reservas de prueba** pre-cargadas
- Click en "Asignar Espacio"
- Selecciona un lugar disponible
- El sistema actualiza todo automáticamente

### 5️⃣ Estadísticas
- Resumen en tiempo real
- Espacios libres/ocupados/reservados
- Reservas pendientes

## 📦 Datos de Prueba Incluidos

### Espacios
- **Total**: 50 espacios (A01 a A50)
- **Estados**: Distribuidos aleatoriamente entre libre, ocupado y reservado
- **Interactivos**: Click para cambiar estado

### Reservas Pendientes
1. **Juan Pérez** - ABC-123 - Código: 4567
2. **Ana López** - XYZ-789 - Código: 8901
3. **Pedro García** - DEF-456 - Código: 2345

### Empleados
- **Carlos Rodríguez** (emp001)
- **María García** (emp002)

## 🔄 Modo de Operación Actual

**🟢 MODO PRUEBA (Mock Data)**
- Todos los datos son locales
- No requiere backend
- Ideal para desarrollo y testing

**🔵 Cuando conectes el backend:**
1. Edita `src/config/api.js`
2. Cambia `useMockData: false`
3. Verifica que `VITE_API_URL` apunte a tu backend

## 🎮 Flujo de Trabajo Típico

1. **Login** → Ingresa como empleado
2. **Ver estado** → Revisa los espacios disponibles
3. **Validar reserva** → Cliente llega, validas su código
4. **Asignar espacio** → Le das un lugar específico
5. **Monitorear** → Ves el estado en tiempo real
6. **Liberar espacios** → Click cuando un cliente se va

## ⚙️ Comandos Útiles

```powershell
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ver el build
npm run preview
```

## 🐛 Solución de Problemas

### No carga el módulo
```powershell
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Puerto ocupado
El servidor usa el puerto 5173. Si está ocupado:
- Cierra otras aplicaciones Vite
- O el sistema te ofrecerá otro puerto automáticamente

### Los datos no se guardan
- Los datos mock se reinician al recargar
- Para persistencia, conecta con el backend

## 📱 Pantallas Disponibles

1. **Login** - Autenticación de empleados
2. **Estacionamiento** - Grid de espacios interactivo
3. **Validar Reserva** - Por código o QR
4. **Reservas Pendientes** - Lista para asignar
5. **Estadísticas** - Dashboard con métricas

## 🎨 Características Visuales

- ✅ Diseño responsive
- ✅ Colores por estado (Verde=Libre, Rojo=Ocupado, Amarillo=Reservado)
- ✅ Temporizador en tiempo real
- ✅ Badges informativos
- ✅ Alertas visuales
- ✅ Modo oscuro preparado

## 📊 Próximos Pasos

**Cuando el backend esté listo:**

1. Verifica los endpoints:
   - `/api/auth/login`
   - `/api/lugares`
   - `/api/reservas`

2. Actualiza la configuración:
   ```javascript
   // src/config/api.js
   useMockData: false
   ```

3. Prueba la conexión:
   - Login con credenciales reales
   - Los datos se cargarán del backend

## 💡 Tips

- **Usa los filtros** para encontrar espacios rápido
- **El temporizador** muestra tu tiempo de sesión
- **Los espacios reservados** tienen contador regresivo
- **Click en "Reiniciar"** si quieres empezar de nuevo
- **Todos los cambios** son inmediatos en la UI

---

**¿Necesitas ayuda?** Revisa el README_EMPLOYEE.md completo para más detalles.
