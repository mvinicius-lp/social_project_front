// src/composables/useDashboard.js
import axios from 'axios'
import { ref } from 'vue'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export default function useDashboard() {
  const loading = ref(false)
  const error = ref(null)

  const stats = ref({
    totalArrecadado: 0,
    totalDoadores: 0,
    doacaoMedia: 0,
    doacoesEsteMes: 0
  })

  const months = ref([])
  const monthlyValues = ref([])
  const pie = ref({ labels: [], data: [] })
  const recentDonations = ref([])

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/dashboard')
      const data = res.data

      // data é o objeto dashboard dentro do db.json
      stats.value.totalArrecadado = data.totalArrecadado ?? 0
      stats.value.totalDoadores = data.totalDoadores ?? 0
      stats.value.doacaoMedia = data.doacaoMedia ?? 0
      stats.value.doacoesEsteMes = data.doacoesEsteMes ?? 0

      months.value = data.months ?? []
      monthlyValues.value = data.monthlyValues ?? []

      pie.value.labels = data.pieLabels ?? []
      pie.value.data = data.pieData ?? []

      recentDonations.value = data.recentDonations ?? []
    } catch (err) {
      console.error('fetchDashboard error', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    stats,
    months,
    monthlyValues,
    pie,
    recentDonations,
    fetchDashboard
  }
}
