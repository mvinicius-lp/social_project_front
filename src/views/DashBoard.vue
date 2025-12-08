<template>
  <div class="layout">
    <Sidebar :active="'dashboard'" @navigate="onNavigate" />

    <main class="main">
      <header class="header">
        <h2>Dashboard</h2>
        <p class="subtitle">Visão geral das doações e doadores</p>
      </header>

      <section class="cards-row">
        <StatCard title="Total Arrecadado" :value="formatCurrency(stats.totalArrecadado)" sub="+12% em relação ao mês anterior">
          <template #icon>💲</template>
        </StatCard>

        <StatCard title="Total de Doadores" :value="stats.totalDoadores" sub="2 novos este mês">
          <template #icon>👥</template>
        </StatCard>

        <StatCard title="Doação Média" :value="formatCurrency(stats.doacaoMedia)" sub="Por doação recebida">
          <template #icon>📈</template>
        </StatCard>

        <StatCard title="Doações Este Mês" :value="stats.doacoesEsteMes" sub="Todas as categorias">
          <template #icon>📦</template>
        </StatCard>
      </section>

      <section class="charts-grid">
        <div class="big">
          <h4>Doações Mensais</h4>
          <p class="muted">Evolução das doações nos últimos meses</p>
          <LineChart :labels="months" :data="monthlyValues" />
        </div>

        <div class="side">
          <h4>Doações por Tipo</h4>
          <p class="muted">Distribuição por categoria</p>
          <!-- Passamos labels já com porcentagem e os dados originais -->
          <PieChart :labels="pieLabelsWithPercent" :data="pie.data" :total="stats.totalArrecadado" />
        </div>
      </section>

      <section class="recent-section">
        <RecentDonations :items="recentDonations" :loading="loading" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import LineChart from '../components/LineChart.vue'
import PieChart from '../components/PieChart.vue'
import RecentDonations from '../components/RecentDonations.vue'
import useDashboard from '../composables/useDashboard' // corrigido para composables

const { loading, stats, months, monthlyValues, pie, recentDonations, fetchDashboard } = useDashboard()

onMounted(() => {
  fetchDashboard()
})

// formata labels do pie adicionando a porcentagem (ex: "Dinheiro 60%")
const pieLabelsWithPercent = computed(() => {
  // pie é um ref para um objeto { labels: [], data: [] } — no template refs são auto-unwrapped,
  // aqui usamos pie.value porque estamos no script.
  const labels = (pie.value && pie.value.labels) || []
  const values = (pie.value && pie.value.data) || []
  const numeric = values.map(v => Number(v || 0))
  const total = numeric.reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0) || 1

  return labels.map((lab, i) => {
    const val = Number(values[i] || 0)
    const pct = Math.round((Number.isFinite(val) ? val : 0) / total * 100)
    return `${lab} ${pct}%`
  })
})

function formatCurrency(v){
  if (v == null) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function onNavigate(page){
  // se usa router, substitua por: router.push({ name: page })
  console.log('navegar para', page)
}
</script>

<style scoped>
.layout{ display:flex; min-height:100vh; font-family: Inter, Arial, sans-serif; background:#f7fbff; }
.main{ flex:1; padding:28px; }
.header h2{ margin:0; color:#113355; }
.subtitle{ margin:6px 0 20px; color:#6f8aa0; }

.cards-row{
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap:18px;
  margin-bottom:22px;
}

/* Charts area */
.charts-grid{
  display:grid;
  grid-template-columns: 2fr 1fr;
  gap:18px;
  align-items:start;
}
.charts-grid .big{ background:transparent; padding:8px; }
.charts-grid .side{ background:transparent; padding:8px; }

h4{ margin:0 0 6px; color:#375a7a; }
.muted{ color:#8fa6bb; margin-bottom:8px; font-size:13px; }

.recent-section{ margin-top:20px; }

/* responsivo */
@media (max-width: 900px){
  .cards-row{ grid-template-columns: repeat(2, 1fr); }
  .charts-grid{ grid-template-columns: 1fr; }
}
</style>
