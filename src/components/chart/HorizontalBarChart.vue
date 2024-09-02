<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import { isMobile } from '@/util/MediaQuery'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  field: String,
  data: Object,
  sortingValue: String,
  maxScale: Number,
  aspectRatio: Number
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
    datasets: [{ data: Object.values(sortedData) }]
  }
})

watch(data, () => {
  chart.data = data.value
  chart.update()
})

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
          },
          ...(props.maxScale ? { max: 40 } : {})
        },
        y: {
          ticks: {
            autoSkip: false,
            stepSize: 1
          }
        }
      },
      aspectRatio: props.aspectRatio ? props.aspectRatio : isMobile ? 0.5 : 0.6
    }
  })
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
