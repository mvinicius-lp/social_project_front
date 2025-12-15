<template>
  <div class="chart-card">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] }
})

const canvas = ref(null)
let chart = null

function formatCurrencyBRL(value){
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  } catch {
    return `R$ ${Number(value).toFixed(2)}`
  }
}

function createChart() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')

  const numericData = (props.data || []).map(v => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  })

  if (chart) {
    chart.destroy()
    chart = null
  }

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.labels || [],
      datasets: [{
        data: numericData,
        backgroundColor: [
          '#2b8af6',
          '#39d2a2',
          '#a78bfa',
          '#fb7185',
          '#f59e0b',
          '#60a5fa',
          '#34d399',
          '#c084fc'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, usePointStyle: true }
        },
        tooltip: {
          callbacks: {
            label(context) {
              const label = context.label ?? ''
              const value = Number(context.raw ?? 0)
              return `${label}: ${formatCurrencyBRL(value)}`
            }
          }
        }
      }
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
    return Number.isFinite(n) ? n : 0
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
  display:flex;
  align-items:center;
  justify-content:center;
}
canvas{
  width:100%;
  height:100% !important;
}
</style>
