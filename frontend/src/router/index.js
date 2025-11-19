import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminRegisterView from '@/views/AdminRegisterView.vue'
import AdminForgotPasswordView from '@/views/AdminForgotPasswordView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import ClientLoginView from '@/views/ClientLoginView.vue'
import ClientRegisterView from '@/views/ClientRegisterView.vue'
import ClientForgotPasswordView from '@/views/ClientForgotPasswordView.vue'
import ClientDashboardView from '@/views/ClientDashboardView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegisterView
    },
    {
      path: '/admin/forgot-password',
      name: 'admin-forgot-password',
      component: AdminForgotPasswordView
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'parking/:id',
          name: 'parking-detail',
          component: () => import('../components/admin/ParkingDetailView.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/components/admin/ProfileView.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/components/admin/SettingsView.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        },
        {
          path: 'register-parking',
          name: 'register-parking',
          component: () => import('@/components/admin/ParkingRegistrationForm.vue'),
          meta: { requiresAuth: true, role: 'admin' }
        }
      ]
    },
    {
      path: '/client/login',
      name: 'client-login',
      component: ClientLoginView
    },
    {
      path: '/client/register',
      name: 'client-register',
      component: ClientRegisterView
    },
    {
      path: '/client/forgot-password',
      name: 'client-forgot-password',
      component: ClientForgotPasswordView
    },
    {
      path: '/client/dashboard',
      name: 'client-dashboard',
      component: ClientDashboardView,
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      component: () => import('../views/VerifyEmailView.vue')
    },
    // ==================== RUTAS DE EMPLEADO ====================
    {
      path: '/employee/login',
      name: 'employee-login',
      component: () => import('../views/EmployeeLoginView.vue')
    },
    {
      path: '/employee/dashboard',
      name: 'employee-dashboard',
      component: () => import('../views/EmployeeDashboardView.vue'),
      meta: { requiresAuth: true, role: 'employee' }
    }
  ]
})

// ==================== NAVIGATION GUARDS ====================

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;

  if (requiresAuth) {
    let isAuthenticated = false;
    let userRole = null;
    let token = null;

    // Verificar según el rol requerido
    if (requiredRole === 'admin') {
      token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token && usuario) {
        const userData = JSON.parse(usuario);
        isAuthenticated = true;
        // Verificar que sea admin (rol_activo o rol.rol_administrador)
        userRole = userData.rol_activo || (userData.rol?.rol_administrador ? 'administrador' : null);
      }
    } else if (requiredRole === 'client') {
      token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      if (token && usuario) {
        const userData = JSON.parse(usuario);
        isAuthenticated = true;
        // Verificar que sea cliente (rol_activo o rol.rol_usuario)
        userRole = userData.rol_activo || (userData.rol?.rol_usuario ? 'usuario' : null);
      }
    } else if (requiredRole === 'employee') {
      token = localStorage.getItem('smartpark_employee_token');
      const employee = localStorage.getItem('smartpark_employee');
      if (token && employee) {
        isAuthenticated = true;
        userRole = 'empleado';
      }
    }

    // Si no está autenticado, redirigir al login correspondiente
    if (!isAuthenticated) {
      if (requiredRole === 'admin') {
        next({ name: 'admin-login' });
      } else if (requiredRole === 'client') {
        next({ name: 'client-login' });
      } else if (requiredRole === 'employee') {
        next({ name: 'employee-login' });
      } else {
        next({ name: 'home' });
      }
      return;
    }

    // Verificar que el rol coincida
    const validRoles = {
      'admin': ['administrador', 'admin'],
      'client': ['usuario', 'client'],
      'employee': ['empleado', 'employee']
    };

    if (validRoles[requiredRole] && !validRoles[requiredRole].includes(userRole)) {
      // Rol incorrecto, redirigir a su dashboard correspondiente
      if (userRole === 'administrador' || userRole === 'admin') {
        next({ name: 'admin-dashboard' });
      } else if (userRole === 'usuario' || userRole === 'client') {
        next({ name: 'client-dashboard' });
      } else if (userRole === 'empleado' || userRole === 'employee') {
        next({ name: 'employee-dashboard' });
      } else {
        next({ name: 'home' });
      }
      return;
    }
  }

  next(); // Continuar con la navegación
});

export default router
