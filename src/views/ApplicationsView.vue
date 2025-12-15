<template>
  <div class="layout">
    <Sidebar :active="'Aplicações'" />

    <div class="applications-page">
      <!-- ===== Header ===== -->
      <div class="page-header">
        <div>
          <h2>Aplicações</h2>
          <p class="subtitle">Transparência no uso das doações recebidas</p>
        </div>

        <button class="btn-primary" @click="openModal">
          + Nova aplicação
        </button>
      </div>

      <!-- ===== Modal ===== -->
      <NewApplicationModal
        v-if="isModalOpen"
        @close="closeModal"
        @submit-success="handleSave"
      />

      <!-- ===== Cards ===== -->
      <div class="summary-cards">
        <div class="card">
          <span class="card-title">Total de Doações</span>
          <strong class="card-value">
            {{ formatCurrency(totalDonations) }}
          </strong>
          <span class="card-subtitle">Valor total arrecadado</span>
        </div>

        <div class="card">
          <span class="card-title">Total Aplicado</span>
          <strong class="card-value">
            {{ formatCurrency(totalApplied) }}
          </strong>
          <span class="card-subtitle">Valor já utilizado</span>
        </div>

        <div class="card highlight">
          <span class="card-title">Saldo Disponível</span>
          <strong class="card-value">
            {{ formatCurrency(availableBalance) }}
          </strong>
          <span class="card-subtitle">Disponível para uso</span>
        </div>
      </div>

      <!-- ===== Tabela ===== -->
      <div class="table-card">
        <div class="table-header">
          <h3>Lista de Aplicações</h3>

          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar por doador, área ou descrição..."
          />
        </div>

        <div v-if="isLoading" class="table-state">
          Carregando aplicações...
        </div>

        <div v-else-if="error" class="table-state error">
          {{ error }}
        </div>

        <table v-else class="applications-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Doador</th>
              <th>Área</th>
              <th>Descrição</th>
              <th class="text-right">Valor</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="app in filteredApplications" :key="app.id">
              <td>{{ formatDate(app.date) }}</td>
              <td>{{ app.donor }}</td>

              <td>
                <span class="badge" :class="`badge-${normalize(app.area)}`">
                  {{ app.area }}
                </span>
              </td>

              <td>{{ app.description }}</td>

              <td class="text-right">
                {{ formatCurrency(app.amount) }}
              </td>
            </tr>

            <tr v-if="filteredApplications.length === 0">
              <td colspan="5" class="empty-state">
                Nenhuma aplicação encontrada.
              </td>
            </tr>
          </tbody>
        </table>

        <div class="table-footer">
          Mostrando {{ filteredApplications.length }} aplicações
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import NewApplicationModal from "@/components/NewApplicationModal.vue";

/* ===== STATE ===== */
const applications = ref([]);
const isLoading = ref(true);
const error = ref(null);

const totalDonations = ref(0);
const totalApplied = ref(0);
const availableBalance = ref(0);

const isModalOpen = ref(false);
const search = ref("");

/* ===== Helpers ===== */
const normalize = (text = "") =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const formatCurrency = (value = 0) =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (date) =>
  new Date(date).toLocaleDateString("pt-BR");

/* ===== FETCH APPLICATIONS ===== */
async function fetchApplications() {
  isLoading.value = true;
  error.value = null;

  try {
    // ---------- BUSCA APLICAÇÕES NEGATIVAS ----------
    const res = await fetch("http://127.0.0.1:8000/applications/");
    const apps = await res.json();
    applications.value = apps;

    // soma valores aplicados
    totalApplied.value = apps.reduce((s, a) => s + Number(a.amount), 0);

    // ---------- BUSCA DOAÇÕES POSITIVAS ----------
    const res2 = await fetch("http://127.0.0.1:8000/donations/");
    const donations = await res2.json();

    totalDonations.value = donations.reduce((s, d) => s + Number(d.value), 0);

    // saldo final
    availableBalance.value = totalDonations.value - totalApplied.value;

  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar aplicações.";
  }

  isLoading.value = false;
}

/* ===== Modal ===== */
function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleSave() {
  await fetchApplications();
  closeModal();
}

/* ===== Filtro ===== */
const filteredApplications = computed(() => {
  if (!search.value) return applications.value;

  const term = search.value.toLowerCase();

  return applications.value.filter((app) =>
    [app.donor, app.area, app.description]
      .filter(Boolean)
      .some((f) => f.toLowerCase().includes(term))
  );
});

/* ===== Lifecycle ===== */
onMounted(fetchApplications);
</script>

<style scoped>
/* (Estilos completos — idênticos ao seu arquivo original) */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f7fbff;
  font-family: Inter, system-ui, sans-serif;
}

.applications-page {
  padding: 24px;
  flex: 1;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.card.highlight {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.card-title {
  font-size: 14px;
  color: #64748b;
}

.card-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.card-subtitle {
  font-size: 14px;
  color: #94a3b8;
}

.table-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.table-header input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  width: 300px;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th,
.applications-table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.applications-table th {
  text-align: left;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.badge-alimentacao {
  background: #dcfce7;
  color: #166534;
}

.badge-medicamentos {
  background: #fee2e2;
  color: #991b1b;
}

.badge-suplementos {
  background: #ede9fe;
  color: #5b21b6;
}

.badge-manutencao {
  background: #fef3c7;
  color: #92400e;
}

.badge-atividades {
  background: #ffe4e6;
  color: #9f1239;
}

.badge-pessoal {
  background: #e0f2fe;
  color: #075985;
}

.table-footer {
  margin-top: 12px;
  font-size: 13px;
  color: #64748b;
}
</style>
