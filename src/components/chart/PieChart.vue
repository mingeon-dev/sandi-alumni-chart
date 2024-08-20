<script setup>
import { computed, onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import PieLabelsLine from '@/util/PieLabelsLine'

const props = defineProps({
  data: Object
})

const canvas = ref()

const data = computed(() => ({
  labels: Object.keys(props.data),
  datasets: [{ data: Object.values(props.data) }]
}))

onMounted(() => {
  createChart()
})

const createChart = () => {
  new Chart(canvas.value, {
    type: 'pie',
    data: data.value,
    plugins: [PieLabelsLine],
    options: {
      layout: {
        padding: 100
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.formattedValue}명`
            }
          }
        }
      }
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
