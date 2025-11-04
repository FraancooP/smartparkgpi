<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 overflow-y-auto pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div class="flex items-center justify-between p-4">
        <button
          @click="$emit('close')"
          class="hover:bg-slate-100 rounded-lg px-3 py-2 transition"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <h1 class="text-xl font-semibold">Acciones Rápidas</h1>
        <div class="w-10" />
      </div>
    </div>

    <div class="p-4 space-y-6">
      <!-- Acciones de Emergencia -->
      <Card class="bg-red-50/50 border-red-200">
        <CardHeader class="pb-3">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-red-600">
            <AlertTriangle class="h-5 w-5" />
            Acciones de Emergencia
          </h2>
        </CardHeader>
        <CardContent class="space-y-3">
          <button class="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-start gap-3 px-4 transition shadow-lg">
            <AlertTriangle class="h-5 w-5" />
            <div class="text-left">
              <p class="font-medium">Reportar Problema</p>
              <p class="text-sm opacity-90">Incidencia en estacionamiento</p>
            </div>
          </button>
          
          <button class="w-full h-14 border-2 border-orange-300 hover:bg-orange-50 text-orange-700 rounded-xl flex items-center justify-start gap-3 px-4 transition">
            <Phone class="h-5 w-5" />
            <div class="text-left">
              <p class="font-medium">Contacto de Emergencia</p>
              <p class="text-sm">Llamada directa a seguridad</p>
            </div>
          </button>
        </CardContent>
      </Card>

      <!-- Acciones Principales -->
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.title"
          :class="[
            'h-32 rounded-2xl border-2 p-4 flex flex-col items-center justify-center space-y-2 transition-all hover:shadow-lg',
            action.bgColor,
            action.borderColor,
            action.color
          ]"
        >
          <component :is="action.icon" class="h-8 w-8" />
          <p class="font-medium text-sm text-center">{{ action.title }}</p>
        </button>
      </div>

      <!-- Promociones -->
      <Card class="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader class="pb-3">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-pink-600">
            <Gift class="h-5 w-5" />
            Promociones
          </h2>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="promo in promotions"
            :key="promo.title"
            :class="[
              'p-4 rounded-xl border-2 flex items-start space-x-3',
              promo.bgColor,
              promo.borderColor
            ]"
          >
            <component :is="promo.icon" :class="['h-8 w-8 flex-shrink-0', promo.color]" />
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <p class="font-semibold">{{ promo.title }}</p>
                <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{{ promo.tag }}</span>
              </div>
              <p class="text-sm text-slate-600">{{ promo.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Utilidades -->
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="util in utilityActions"
          :key="util.title"
          class="h-24 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center space-y-2 transition hover:shadow-md"
        >
          <component :is="util.icon" :class="['h-6 w-6', util.color]" />
          <p class="text-xs font-medium text-center text-slate-700">{{ util.title }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, AlertTriangle, Phone, CreditCard, MapPinIcon, MessageSquare, Star, Gift, Zap, FileText } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

defineEmits(['close'])

const quickActions = [
  {
    title: "Recargar Saldo",
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    title: "Buscar Parking",
    icon: MapPinIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "Chat Soporte",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    title: "Calificar",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  }
]

const promotions = [
  {
    title: "Descuento 20%",
    description: "En tu próxima reserva de más de 2 horas",
    icon: Gift,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    tag: "¡Oferta!"
  },
  {
    title: "Recarga Express",
    description: "Bono del 10% al recargar más de $5000",
    icon: Zap,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    tag: "Limitado"
  }
]

const utilityActions = [
  {
    title: "Generar Factura",
    icon: FileText,
    color: "text-slate-600"
  },
  {
    title: "Compartir App",
    icon: Gift,
    color: "text-indigo-600"
  }
]
</script>
