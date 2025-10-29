<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Eliminar Estacionamiento</h2>
      
      <p class="text-gray-600 mb-6">
        ¿Está seguro que desea eliminar este estacionamiento? Esta acción no se puede deshacer.
      </p>

      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
        <button
          @click="$emit('delete')"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  parkingId: {
    type: String,
    required: true
  }
})

defineEmits(['close', 'delete'])
</script>