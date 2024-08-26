<script setup>
import { computed, onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import { isMobile } from '@/util/MediaQuery'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  field: String,
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
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length === 1 ? 'pointer' : 'default'
      },
      onClick: (event, elements, chart) => {
        if (elements[0]) {
          router.push({
            path: '/list',
            query: { title: props.field, value: chart.data.labels[elements[0].index] }
          })
        }
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
      aspectRatio: isMobile ? 0.5 : 0.6
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
