<script setup>
import { computed, onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  data: Object
})

const canvas = ref()

const data = computed(() => {
  const sortedData = Object.entries(props.data)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
  return {
    labels: Object.keys(sortedData),
    datasets: [{ data: Object.values(sortedData) }]
  }
})

onMounted(() => {
  createChart()
})

const createChart = () => {
  new Chart(canvas.value, {
    type: 'bar',
    data: data.value,
    options: {
      indexAxis: 'y',
      layout: {
        padding: 20
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
      },
      scales: {
        x: {
          ticks: {
            callback: (value) => `${value}명`
          }
        },
        y: {
          ticks: {
            autoSkip: false,
            stepSize: 1
          }
        }
      },
      aspectRatio: 1
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
