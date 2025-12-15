<template>
  <div class="layout">
    <Sidebar :active="'dashboard'" @navigate="onNavigate" @logout="handleLogout" />

    <main class="main">
      <header class="header">
        <h2>Dashboard</h2>
        <p class="subtitle">Visão geral das doações e doadores</p>
      </header>

      <!-- KPIs -->
      <section class="cards-row">
        <StatCard
          title="Total Arrecadado"
          :value="formatCurrency(stats.totalArrecadado)"
          sub="+12% em relação ao mês anterior"
        >
          <template #icon>💲</template>
        </StatCard>

        <StatCard
          title="Total de Doadores"
          :value="stats.totalDoadores"
          sub="Doadores cadastrados"
        >
          <template #icon>👥</template>
        </StatCard>

        <StatCard
          title="Doação Média"
          :value="formatCurrency(stats.doacaoMedia)"
          sub="Por doação recebida"
        >
          <template #icon>📈</template>
        </StatCard>

        <StatCard
          title="Doações Este Mês"
          :value="stats.doacoesEsteMes"
          sub="Todas as categorias"
        >
          <template #icon>📦</template>
        </StatCard>
      </section>

      <!-- SALDO -->
      <section class="balance-section">
        <BalanceCard
          :total-arrecadado="stats.totalArrecadado"
          :total-aplicado="stats.totalAplicado"
          :saldo="stats.saldoDisponivel"
        />
      </section>

      <!-- GRÁFICOS -->
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

      <!-- RECENTES -->
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
import BalanceCard from "../components/BalanceCard.vue";
import useDashboard from "../components/useDashboard";

const router = useRouter();

/* Estado base (mantido exatamente como estava) */
const {
  loading,
  stats,
  months,
  monthlyValues,
  pie,
  recentDonations,
  fetchDashboard
} = useDashboard();

/* ---------- DASHBOARD KPIs (inalterado) ---------- */
async function loadBackendDashboard() {
  try {
    const res = await fetch("http://127.0.0.1:8000/dashboard", {
      headers: { accept: "application/json" }
    });

    if (!res.ok) {
      console.error("Erro ao buscar dashboard do backend");
      return;
    }

    const data = await res.json();

    stats.value.totalArrecadado = Number(data.totalArrecadado || 0);
    stats.value.totalDoadores = Number(data.totalDoadores || 0);
    stats.value.doacaoMedia = Number(data.doacaoMedia || 0);
    stats.value.doacoesEsteMes = Number(data.doacoesMes || 0);

  } catch (error) {
    console.error("Erro integrando backend dashboard:", error);
  }
}

/* ---------- SALDO DISPONÍVEL (inalterado) ---------- */
async function loadSaldoDisponivel() {
  try {
    const res = await fetch("http://127.0.0.1:8000/dashboard/saldo", {
      headers: { accept: "application/json" }
    });

    if (!res.ok) {
      console.error("Erro ao buscar saldo disponível");
      return;
    }

    const data = await res.json();

    stats.value.totalArrecadado = Number(data.totalArrecadado || 0);
    stats.value.totalAplicado = Number(data.totalAplicado || 0);
    stats.value.saldoDisponivel = Number(data.saldoDisponivel || 0);

  } catch (error) {
    console.error("Erro integrando saldo disponível:", error);
  }
}

/* ---------- 🔹 AJUSTE ÚNICO: GRÁFICOS REAIS ---------- */
async function loadChartsFromApi() {
  try {
    const res = await fetch("http://127.0.0.1:8000/dashboard/charts", {
      headers: { accept: "application/json" }
    });

    if (!res.ok) {
      console.error("Erro ao buscar gráficos do backend");
      return;
    }

    const data = await res.json();

    // sobrescreve APENAS os dados dos gráficos
    months.value = data.line?.labels || [];
    monthlyValues.value = data.line?.data || [];

    pie.value.labels = data.pie?.labels || [];
    pie.value.data = data.pie?.data || [];

  } catch (error) {
    console.error("Erro integrando gráficos:", error);
  }
}

onMounted(async () => {
  await fetchDashboard();        // mantém comportamento atual
  await loadBackendDashboard();  // KPIs
  await loadSaldoDisponivel();   // saldo
  await loadChartsFromApi();     // 🔹 gráficos reais
});

/* ---------- HELPERS (inalterado) ---------- */
function formatCurrency(value) {
  return `R$ ${Number(value || 0).toFixed(2)}`;
}

async function handleLogout() {
  try {
    await fetch("http://127.0.0.1:8000/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Erro ao fazer logout:", err);
  }

  localStorage.removeItem("token");
  router.push("/login");
}

const pieLabelsWithPercent = computed(() => {
  const labels = pie.value?.labels || [];
  const values = pie.value?.data || [];

  const numeric = values.map((v) => Number(v || 0));
  const total =
    numeric.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0) || 1;

  return labels.map((lab, i) => {
    const val = Number(values[i] || 0);
    const pct = Math.round(((Number.isFinite(val) ? val : 0) / total) * 100);
    return `${lab} ${pct}%`;
  });
});

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
