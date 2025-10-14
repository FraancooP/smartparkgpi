<template>
  <AdminRegister 
    @back="goBack"
    @register="handleRegister"
    @login="goToLogin"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import AdminRegister from '@/components/AdminRegister.vue'

const router = useRouter()

const goBack = () => {
  router.push('/admin/login')
}

const goToLogin = () => {
  router.push('/admin/login')
}

const handleRegister = () => {
  console.log('Admin registered successfully')
  // Aquí redireccionar o mostrar confirmación
  router.push('/admin/login')
}
</script>
