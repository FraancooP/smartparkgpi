<template>
  <div class="w-full h-64">
    <Bar
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    data: {
      // Accept either an array of { day, value } objects or a full Chart.js data object
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    chartData() {
      if (!this.data) return null;

      // If an array is provided, convert it to the Chart.js data structure
      if (Array.isArray(this.data)) {
        return {
          labels: this.data.map(d => d.day),
          datasets: [
            {
              label: 'Ingresos',
              data: this.data.map(d => d.value),
              backgroundColor: 'rgba(59, 130, 246, 0.5)'
            }
          ]
        };
      }

      // If data already looks like a Chart.js data object (labels + datasets), pass it through
      if (this.data.labels && this.data.datasets) {
        return this.data;
      }

      // Fallback: try to detect an object with an array under 'data' or 'values'
      if (Array.isArray(this.data.data)) {
        return {
          labels: this.data.data.map((d, i) => d.label || `Item ${i+1}`),
          datasets: [
            {
              label: this.data.label || 'Dataset',
              data: this.data.data.map(d => d.value ?? d),
              backgroundColor: this.data.backgroundColor || 'rgba(59, 130, 246, 0.5)'
            }
          ]
        };
      }

      // Unknown shape — return null to avoid runtime errors
      return null;
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    }
  }
};
</script>