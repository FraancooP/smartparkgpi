import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminRegisterView from '@/views/AdminRegisterView.vue'
import AdminForgotPasswordView from '@/views/AdminForgotPasswordView.vue'
import ClientLoginView from '@/views/ClientLoginView.vue'
import ClientRegisterView from '@/views/ClientRegisterView.vue'
import ClientForgotPasswordView from '@/views/ClientForgotPasswordView.vue'

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
    }
  ]
})

export default router
