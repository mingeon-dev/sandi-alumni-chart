<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import { isMobile } from '@/util/MediaQuery'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  field: String,
  data: Object,
  sortingValue: String,
  maxScale: Number
})

const canvas = ref()
let chart = null

const data = computed(() => {
  const sortedData = props.sortingValue
    ? Object.entries(props.data)
        .sort(([label1, data1], [label2, data2]) => {
          if (props.sortingValue === 'label') {
            return label1 > label2 ? 1 : -1
          } else {
            return data2 - data1
          }
        })
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
    : props.data
  return {
    labels: Object.keys(sortedData),
    datasets: [{ data: Object.values(sortedData), maxBarThickness: 20 }]
  }
})

const aspectRatio = computed(() => {
  const dataLength = data.value.labels.length
  return Math.min(1, 15 / dataLength)
})

watch(data, () => {
  chart.data = data.value
  chart.update()
  if (isMobile) {
    chart.options.aspectRatio = aspectRatio.value
    chart.resize()
  }
})

watch(
  () => props.maxScale,
  () => {
    chart.options.scales.x.max = props.maxScale
    chart.update()
  }
)

onMounted(() => {
  createChart()
})

const createChart = () => {
  chart = new Chart(canvas.value, {
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
          const routes = route.query?.title
            ? {
                path: '/list',
                query: {
                  ...route.query,
                  title2: props.field,
                  value2: chart.data.labels[elements[0].index]
                }
              }
            : {
                path: '/',
                query: { title: props.field, value: chart.data.labels[elements[0].index] }
              }
          router.push(routes)
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
            callback: (value) => (Number.isInteger(value) ? `${value}명` : '')
          },
          ...(props.maxScale ? { max: props.maxScale } : {})
        },
        y: {
          ticks: {
            callback: function (value) {
              const maxLength = 15
              const label = this.getLabelForValue(value)
              return typeof label === 'string' && label.length > maxLength
                ? `${label.substring(0, maxLength)}...`
                : label
            },
            autoSkip: false,
            stepSize: 1
          }
        }
      },
      aspectRatio: isMobile ? aspectRatio.value : 0.6
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
