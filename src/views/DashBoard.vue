<template>
  <div class="layout">
    <Sidebar :active="'dashboard'" @navigate="onNavigate" @logout="handleLogout" />

    <main class="main">
      <header class="header">
        <h2>Dashboard</h2>
        <p class="subtitle">Visão geral das doações e doadores</p>
      </header>

      <section class="cards-row">
        <StatCard
          title="Total Arrecadado"
          :value="formatCurrency(stats.totalArrecadado)"
          sub="+12% em relação ao mês anterior"
        >
          <template #icon>💲</template>
        </StatCard>

        <StatCard title="Total de Doadores" :value="stats.totalDoadores" sub="2 novos este mês">
          <template #icon>👥</template>
        </StatCard>

        <StatCard
          title="Doação Média"
          :value="formatCurrency(stats.doacaoMedia)"
          sub="Por doação recebida"
        >
          <template #icon>📈</template>
        </StatCard>

        <StatCard title="Doações Este Mês" :value="stats.doacoesEsteMes" sub="Todas as categorias">
          <template #icon>📦</template>
        </StatCard>
      </section>
      <section class="balance-section">
        <BalanceCard
          :total-arrecadado="stats.totalArrecadado"
          :total-aplicado="stats.totalAplicado"
        />
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
          <PieChart
            :labels="pieLabelsWithPercent"
            :data="pie.data"
            :total="stats.totalArrecadado"
          />
        </div>
      </section>

      <section class="recent-section">
        <RecentDonations :items="recentDonations" :loading="loading" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import Sidebar from "../components/Sidebar.vue";
import StatCard from "../components/StatCard.vue";
import LineChart from "../components/LineChart.vue";
import PieChart from "../components/PieChart.vue";
import RecentDonations from "../components/RecentDonations.vue";
import useDashboard from "../components/useDashboard";
import BalanceCard from "../components/BalanceCard.vue";

const router = useRouter();

const { loading, stats, months, monthlyValues, pie, recentDonations, fetchDashboard } =
  useDashboard();

onMounted(() => {
  fetchDashboard();
});

async function handleLogout() {
  try {
    await fetch("http://127.0.0.1:8000/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    console.error("Erro ao fazer logout:", err);
  }

  // remover token e redirecionar
  localStorage.removeItem("token");
  router.push("/login");
}

const pieLabelsWithPercent = computed(() => {
  const labels = pie.value?.labels || [];
  const values = pie.value?.data || [];
  const numeric = values.map((v) => Number(v || 0));
  const total = numeric.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0) || 1;

  return labels.map((lab, i) => {
    const val = Number(values[i] || 0);
    const pct = Math.round(((Number.isFinite(val) ? val : 0) / total) * 100);
    return `${lab} ${pct}%`;
  });
});

function formatCurrency(v) {
  if (v == null) return "-";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function onNavigate(page) {
  console.log("navigate:", page);
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  font-family: Inter, Arial, sans-serif;
  background: #f7fbff;
}
.main {
  flex: 1;
  padding: 28px;
}
.header h2 {
  margin: 0;
  color: #113355;
}
.subtitle {
  margin: 6px 0 20px;
  color: #6f8aa0;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 10px;
}

.charts-grid .big,
.charts-grid .side {
  padding: 8px;
}

.recent-section {
  margin-top: 20px;
}

@media (max-width: 900px) {
  .cards-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
