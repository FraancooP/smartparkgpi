<template>
  <ClientLogin 
    @back="goBack"
    @login="handleLogin"
    @forgot-password="handleForgotPassword"
    @register="handleRegister"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import ClientLogin from '@/components/ClientLogin.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

const handleLogin = () => {
  console.log('Client logged in')
  // Redireccionar al dashboard de cliente
  router.push('/client/dashboard')
}

const handleForgotPassword = () => {
  router.push('/client/forgot-password')
}

const handleRegister = () => {
  router.push('/client/register')
}
</script>
