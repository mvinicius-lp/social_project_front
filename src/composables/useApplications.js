// src/composables/useApplications.js

import { ref, readonly, computed } from 'vue'
import db from '/mock/db.json'

// Estado global (singleton)
const applications = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useApplications() {

  const fetchApplications = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simula latência
      await new Promise(resolve => setTimeout(resolve, 300))

      const data = db.applications ?? []

      // Ordena por data (mais recente primeiro)
      applications.value = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )

    } catch (err) {
      console.error('Erro ao carregar aplicações:', err)
      error.value = 'Falha ao carregar as aplicações.'
    } finally {
      isLoading.value = false
    }
  }

  // ======= CÁLCULOS (regra de negócio) =======

  const totalDonations = computed(() => {
    return (db.donations ?? []).reduce(
      (total, donation) => total + Number(donation.amount || 0),
      0
    )
  })

  const totalApplied = computed(() => {
    return applications.value.reduce(
      (total, app) => total + Number(app.amount || 0),
      0
    )
  })

  const availableBalance = computed(() => {
    return totalDonations.value - totalApplied.value
  })

  // ======= AÇÕES =======

  const addApplication = async (newApplication) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const applicationWithId = {
        ...newApplication,
        id: crypto.randomUUID?.() ?? Date.now().toString(),
      }

      applications.value.unshift(applicationWithId)

      return applicationWithId

    } catch (err) {
      console.error('Erro ao adicionar aplicação:', err)
      error.value = 'Falha ao salvar a aplicação.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // estado
    applications: readonly(applications),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // dados derivados
    totalDonations,
    totalApplied,
    availableBalance,

    // ações
    fetchApplications,
    addApplication,
  }
}
