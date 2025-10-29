<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

// Registrar los componentes necesarios de Chart.js
Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  // Accept either a Chart.js data object ({ labels, datasets }) or an
  // array of items like [{ label, value }] or [{ day, value }].
  data: {
    type: [Array, Object],
    required: true
  }
})

const chartCanvas = ref(null)
let chart = null

const createChart = () => {
  if (chart) {
    chart.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  // Normalize incoming data to Chart.js format
  let normalized = props.data
  if (Array.isArray(props.data)) {
    normalized = {
      labels: props.data.map(d => d.label ?? d.day ?? `Item`),
      datasets: [
        {
          data: props.data.map(d => d.value ?? 0),
          backgroundColor: props.data.map((_, i) => {
            // simple color palette fallback
            const palette = ['#3b82f6', '#22c55e', '#f97316', '#e11d48', '#a78bfa']
            return palette[i % palette.length]
          })
        }
      ]
    }
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: normalized,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })
</script>