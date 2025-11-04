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

export default router
