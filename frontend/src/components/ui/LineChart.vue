<template>
  <div class="w-full h-64">
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'LineChart',
  components: {
    Line
  },
  props: {
    data: {
      // Accept either an array of { hour, value } objects or a full Chart.js data object
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    chartData() {
      if (!this.data) return null;

      if (Array.isArray(this.data)) {
        return {
          labels: this.data.map(d => d.hour),
          datasets: [
            {
              label: 'Ocupación',
              data: this.data.map(d => d.value),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.5)'
            }
          ]
        };
      }

      if (this.data.labels && this.data.datasets) {
        return this.data;
      }

      // Fallback: try to extract from an object with a 'data' array
      if (Array.isArray(this.data.data)) {
        return {
          labels: this.data.data.map((d, i) => d.label || `Item ${i+1}`),
          datasets: [
            {
              label: this.data.label || 'Dataset',
              data: this.data.data.map(d => d.value ?? d),
              borderColor: this.data.borderColor || '#3b82f6',
              backgroundColor: this.data.backgroundColor || 'rgba(59, 130, 246, 0.5)'
            }
          ]
        };
      }

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