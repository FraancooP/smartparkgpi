<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Editar Información del Estacionamiento</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Ubicación</label>
            <input
              v-model="form.location"
              type="text"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Imagen URL</label>
            <input
              v-model="form.image"
              type="url"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tarifa Auto</label>
              <input
                v-model="form.rates.auto"
                type="number"
                min="0"
                step="0.01"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tarifa Moto</label>
              <input
                v-model="form.rates.moto"
                type="number"
                min="0"
                step="0.01"
                class="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <Button variant="outline" type="button" @click="$emit('close')">
            Cancelar
          </Button>
          <Button type="submit">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Button from '../ui/Button.vue';

export default {
  name: 'EditParkingInfoDialog',
  
  components: {
    Button,
  },

  props: {
    parking: {
      type: Object,
      required: true,
    },
  },

  emits: ['close', 'update'],

  setup(props, { emit }) {
    const form = ref({
      name: props.parking.name,
      location: props.parking.location,
      image: props.parking.image,
      rates: {
        auto: props.parking.rates?.auto || 0,
        moto: props.parking.rates?.moto || 0,
      },
    });

    const handleSubmit = async () => {
      try {
        // Aquí implementaremos la llamada a la API
        // const response = await fetch(`/api/parkings/${props.parking.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(form.value),
        // });
        // const updatedParking = await response.json();
        
        emit('update', form.value);
      } catch (error) {
        console.error('Error al actualizar el estacionamiento:', error);
      }
    };

    return {
      form,
      handleSubmit,
    };
  },
};
</script>