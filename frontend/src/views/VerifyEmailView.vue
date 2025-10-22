<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <Card class="bg-slate-800 border-slate-700 shadow-2xl max-w-md w-full">
      <CardContent class="pt-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-slate-300">Verificando tu email...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="text-center py-8">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl text-white font-bold mb-2">¡Email Verificado!</h2>
          <p class="text-slate-400 mb-6">Tu cuenta ha sido activada exitosamente.</p>
          <Button @click="$router.push('/client/login')" class="bg-blue-600 hover:bg-blue-700">
            Iniciar Sesión
          </Button>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-2xl text-white font-bold mb-2">Error de Verificación</h2>
          <p class="text-slate-400 mb-6">{{ errorMessage }}</p>
          <Button @click="$router.push('/client/register')" class="bg-blue-600 hover:bg-blue-700">
            Volver al Registro
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')

const verifyEmail = async () => {
  const token = route.query.token

  if (!token) {
    loading.value = false
    errorMessage.value = 'Token de verificación no encontrado'
    return
  }

  try {
    const response = await fetch('http://localhost:4000/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })

    const data = await response.json()

    if (response.ok) {
      success.value = true
    } else {
      errorMessage.value = data.error || 'Error al verificar el email'
    }
  } catch (error) {
    errorMessage.value = 'No se pudo conectar con el servidor'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyEmail()
})
</script>