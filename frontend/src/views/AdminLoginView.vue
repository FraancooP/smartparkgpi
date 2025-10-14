<template>
  <AdminLogin 
    @back="goBack"
    @login="handleLogin"
    @forgot-password="handleForgotPassword"
    @register="handleRegister"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import AdminLogin from '@/components/AdminLogin.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

const handleLogin = () => {
  console.log('Admin logged in')
  // Aquí redireccionar al dashboard de admin
}

const handleForgotPassword = () => {
  router.push('/admin/forgot-password')
}

const handleRegister = () => {
  router.push('/admin/register')
}
</script>
