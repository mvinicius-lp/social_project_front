<template>
  <div class="donation-table-container">

    <div v-if="loading" class="loading">
      Carregando doações...
    </div>

    <div v-else>

      <!-- CAMPO DE BUSCA -->
      <input
        type="text"
        class="search"
        v-model="search"
        placeholder="Pesquisar por doador, tipo, descrição ou data..."
      />

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Doador</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th class="text-right">Valor</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="donation in filteredDonations" :key="donation.id">
            <td>{{ formatDate(donation.date) }}</td>
            <td>{{ donation.donor }}</td>

            <td>
              <span :class="['type-tag', getTypeClass(donation.type)]">
                {{ donation.type }}
              </span>
            </td>

            <td>{{ donation.description }}</td>

            <td class="text-right">
              R$ {{ formatValue(donation.value) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- COUNT DAS DOAÇÕES -->
      <p class="count">
        Mostrando {{ filteredDonations.length }} doações
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const donations = ref([]);
const loading = ref(false);
const search = ref("");   // CAMPO DE PESQUISA

// Mapeamento das tags
const typeMap = {
  'Dinheiro': 'type-money',
  'Alimentos': 'type-food',
  'Medicamentos': 'type-medicine',
  'Roupas': 'type-clothes',
  'Outros': 'type-other'
};

const getTypeClass = (type) => typeMap[type] || 'type-default';

// Formatador de valores
const formatValue = (val) => {
  if (val == null) return "0,00";
  return Number(val).toFixed(2).replace('.', ',');
};

// Mantém a data exatamente como vem do backend
const formatDate = (dateStr) => dateStr || "-";

// FILTRO DAS DOAÇÕES
const filteredDonations = computed(() => {
  const t = search.value.toLowerCase();

  return donations.value.filter(d =>
    d.donor.toLowerCase().includes(t) ||
    d.type.toLowerCase().includes(t) ||
    (d.description || "").toLowerCase().includes(t) ||
    (d.date || "").toLowerCase().includes(t)
  );
});

// GET /donations
const fetchDonations = async () => {
  loading.value = true;

  try {
    const res = await fetch("http://127.0.0.1:8000/donations/", {
      method: "GET",
      headers: { accept: "application/json" }
    });

    if (!res.ok) {
      alert("Erro ao carregar doações.");
      return;
    }

    donations.value = await res.json();

  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    alert("Erro de conexão com o backend.");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDonations);
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.donation-table-container {
  overflow-x: auto;
}

/* Campo de busca */
.search {
  width: 60%;
  margin: 0 auto 20px auto;
  padding: 10px;
  display: block;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

table {
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
  border-spacing: 2px 8px;
}

th {
  text-align: left;
  padding: 12px 16px;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px 16px;
  color: #374151;
  border-bottom: 3px solid #f3f4f2;
}

.text-right {
  text-align: right;
}

.count {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #6b7280;
}

/* BADGES */
.type-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.type-money {
  background-color: #e0f2fe;
  color: #0b91e9;
}
.type-food {
  background-color: #ecfdf5;
  color: #10b981;
}
.type-medicine {
  background-color: #fee2e2;
  color: #ef4444;
}
.type-clothes {
  background-color: #fef3c7;
  color: #f59e0b;
}
.type-other {
  background-color: #f3e8ff;
  color: #8b5cf6;
}
.type-default {
  background-color: #e5e7eb;
  color: #6b7280;
}
</style>
