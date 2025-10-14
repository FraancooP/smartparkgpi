<template>
  <AdminForgotPassword 
    @back="goBack"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
import AdminForgotPassword from '@/components/AdminForgotPassword.vue'

const router = useRouter()

const goBack = () => {
  router.push('/admin/login')
}

const handleSubmit = () => {
  console.log('Password recovery email sent')
  // Mostrar mensaje de éxito
  alert('Se han enviado las instrucciones a tu email')
  router.push('/admin/login')
}
</script>
