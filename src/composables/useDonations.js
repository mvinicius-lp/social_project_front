// src/composables/useDonations.js

import { ref, readonly } from 'vue'
import db from '/mock/db.json' // ajuste o path se necessário

// Estado global (singleton)
const donations = ref([])
const isLoading = ref(false)
const error = ref(null)

export function useDonations() {

  const fetchDonations = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simula delay de rede (opcional, mas realista)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Lê direto do mock
      const data = db.donations ?? []

      // Ordena por data (mais recente primeiro)
      donations.value = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )

    } catch (err) {
      console.error('Erro ao carregar doações:', err)
      error.value = 'Falha ao carregar as doações.'
    } finally {
      isLoading.value = false
    }
  }

  const addDonation = async (newDonation) => {
    isLoading.value = true
    error.value = null

    try {
      // Simula delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Gera ID fake
      const donationWithId = {
        ...newDonation,
        id: crypto.randomUUID?.() ?? Date.now().toString(),
      }

      // Atualiza apenas o estado local
      donations.value.unshift(donationWithId)

      return donationWithId

    } catch (err) {
      console.error('Erro ao adicionar doação:', err)
      error.value = 'Falha ao salvar a doação.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    donations: readonly(donations),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchDonations,
    addDonation,
  }
}
