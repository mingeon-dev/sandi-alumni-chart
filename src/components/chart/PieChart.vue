<script setup>
import { computed, onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'
import PieLabelsLine from '@/util/PieLabelsLine'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  field: String,
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
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length === 1 ? 'pointer' : 'default'
      },
      onClick: (event, elements, chart) => {
        if (elements[0]) {
          router.push({
            path: '/list',
            query: { [props.field]: chart.data.labels[elements[0].index] }
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
      }
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
