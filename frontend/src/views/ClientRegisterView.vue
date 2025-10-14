<template>
  <ClientRegister 
    @back="goBack"
    @register="handleRegister"
    @login="goToLogin"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import ClientRegister from '@/components/ClientRegister.vue'

const router = useRouter()

const goBack = () => {
  router.push('/client/login')
}

const goToLogin = () => {
  router.push('/client/login')
}

const handleRegister = () => {
  console.log('Client registered successfully')
  // Aquí redireccionar o mostrar confirmación
  router.push('/client/login')
}
</script>
