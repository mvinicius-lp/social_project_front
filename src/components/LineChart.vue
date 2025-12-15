<template>
  <div class="chart-card">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  title: { type: String, default: '' }
})

const canvas = ref(null)
let chart = null

function createChart() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')

  const numericData = (props.data || []).map(v => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  })

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.labels || [],
      datasets: [{
        label: props.title || '',
        data: numericData,
        fill: true,
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 4,
        backgroundColor: 'rgba(59,130,246,0.12)',
        borderColor: 'rgba(59,130,246,0.9)',
        pointBackgroundColor: 'rgba(59,130,246,0.9)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
        x: {}
      },
      plugins: { legend: { display: false } }
    }
  })
}

function updateChart() {
  if (!chart) {
    createChart()
    return
  }

  chart.data.labels = props.labels || []
  chart.data.datasets[0].data = (props.data || []).map(v => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  })
  chart.update()
}

onMounted(async () => {
  await nextTick()
  createChart()
})

watch(() => props.data, updateChart, { immediate: true })
watch(() => props.labels, updateChart, { immediate: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.chart-card{
  background:#fff;
  border:1px solid #eef4fa;
  padding:12px;
  border-radius:10px;
  height:320px;
}
canvas{
  width:100%;
  height:100% !important;
}
</style>
