<template>
  <ClientForgotPassword 
    @back="goBack"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import ClientForgotPassword from '@/components/ClientForgotPassword.vue'

const router = useRouter()

const goBack = () => {
  router.push('/client/login')
}

const handleSubmit = () => {
  console.log('Password recovery email sent')
  // Mostrar mensaje de éxito
  alert('Se han enviado las instrucciones a tu email')
  router.push('/client/login')
}
</script>
