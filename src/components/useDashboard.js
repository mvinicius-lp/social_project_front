import { ref } from 'vue'

export default function useDashboard() {
  const loading = ref(true)

  const stats = ref({
    totalArrecadado: 12500,
    totalAplicado: 3350,
    totalDoadores: 42,
    doacaoMedia: 178,
    doacoesEsteMes: 19
  })

  const months = ref(["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"])
  const monthlyValues = ref([1200, 1800, 900, 2500, 3000, 2100])

  const pie = ref({
    labels: ["Dinheiro", "Alimentos", "Roupas"],
    data: [7500, 3500, 1500]
  })

  const recentDonations = ref([
    {
      id: 1,
      donorName: "Carlos Silva",
      type: "Dinheiro",
      description: "Doação em espécie",
      amount: 150,
      date: "2025-11-03"
    },
    {
      id: 2,
      donorName: "Ana Souza",
      type: "Alimentos",
      description: "Cesta básica",
      amount: 80,
      date: "2025-11-02"
    },
    {
      id: 3,
      donorName: "João Pedro",
      type: "Roupas",
      description: "Agasalhos",
      amount: 120,
      date: "2025-11-01"
    }
  ])

  async function fetchDashboard() {
    await new Promise(r => setTimeout(r, 300))
    loading.value = false
  }

  return {
    loading,
    stats,
    months,
    monthlyValues,
    pie,
    recentDonations,
    fetchDashboard
  }
}
