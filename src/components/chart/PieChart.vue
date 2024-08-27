<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import PieLabelsLine from '@/util/PieLabelsLine'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  field: String,
  data: Object,
  unit: String
})

const canvas = ref()
let chart = null

const data = computed(() => {
  const sortedData = Object.entries(props.data)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
  return {
    labels: Object.keys(sortedData),
    datasets: [{ data: Object.values(sortedData) }]
  }
})

watch(
  () => props.unit,
  () => {
    chart.options.plugins.pieLabelsLine.unit = props.unit
    chart.update()
  }
)

onMounted(() => {
  createChart()
})

const createChart = () => {
  chart = new Chart(canvas.value, {
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
              const sum = context.dataset.data.reduce((a, b) => a + b, 0)
              return props.unit === 'percent'
                ? `${context.formattedValue}명`
                : `${((context.raw * 100) / sum).toFixed(0)}%`
            }
          }
        },
        pieLabelsLine: {
          unit: props.unit
        }
      }
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
