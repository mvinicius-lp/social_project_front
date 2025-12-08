<template>
  <div class="donations-page-content">
    
    <div class="page-header">
      <div class="header-text">
        <h2>Doações</h2>
        <p class="history-title">Histórico de todas as doações recebidas</p>
      </div>
      
      <button class="new-donation-button" @click="openNewDonationModal" :disabled="isLoading">
        <span class="plus-icon">+</span> Nova Doação
      </button>
    </div>

    <div class="content-card">
      
      <div class="list-header">
        <h4>Lista de Doações</h4>
        <p>Pesquise e visualize todas as doações</p>
      </div>

      <div class="search-bar-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Pesquisar por doador, tipo ou descrição..." 
          class="search-input"
        />
      </div>
      <div v-if="isLoading && !donations.length" class="loading-state">
        Carregando dados... Por favor, certifique-se de que o JSON Server está rodando na porta 3000.
      </div>
      
      <div v-else-if="error" class="error-state">
        Erro: {{ error }}
      </div>
      
      <div v-else>
        <DonationsTable :donations="filteredDonations" />

        <div class="pagination-footer">
          Mostrando {{ filteredDonations.length }} de {{ donations.length }} doações
        </div>
      </div>

    </div>

    <NewDonationModal 
      v-if="isModalOpen" 
      @close="closeModal" 
      @add-donation="handleAddDonation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DonationsTable from '../components/DonationsTable.vue'; // Caminho relativo para componentes
import NewDonationModal from '../components/NewDonationModal.vue'; // Caminho relativo para componentes
import { useDonations } from '../composables/useDonations'; // Caminho relativo para composables

// --- Composable State and Methods ---
const { donations, isLoading, error, fetchDonations, addDonation } = useDonations();

// --- Local State ---
const searchQuery = ref('');
const isModalOpen = ref(false);

// --- Lifecycle Hook para carregar dados ao montar ---
onMounted(() => {
  fetchDonations();
});

// --- Computed para Filtragem (alterado para usar 'donations' do Composable) ---
const filteredDonations = computed(() => {
  if (!searchQuery.value) {
    return donations.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  
  return donations.value.filter(donation => {
    return (
      donation.donor.toLowerCase().includes(query) ||
      donation.type.toLowerCase().includes(query) ||
      donation.description.toLowerCase().includes(query)
    );
  });
});

// --- Métodos de Ação ---
const openNewDonationModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// NOVO: Método para Adicionar Doação (usando o Composable)
const handleAddDonation = async (newDonationData) => {
  // A função addDonation do composable já faz a chamada POST e atualiza o estado
  const result = await addDonation(newDonationData);
  
  if (result) {
    console.log('Doação salva com sucesso no servidor mock!', result);
    closeModal();
  } 
  // O Composable gerencia o erro, mas podemos adicionar um feedback aqui se 'result' for nulo.
};
</script>

<style scoped>

.donations-page-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header-text h2 {
  margin: 0;
  font-size: 24px;
  color: #111827; /* Cinza escuro */
}

.list-header h4{
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #111827; /* Cinza escuro */
}

.list-header p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #6b7280; /* Cinza médio */
}

.loading-state, .error-state {
  padding: 20px;
  text-align: center;
  font-weight: 600;
  color: #f59e0b; /* Amarelo/Laranja para feedback */
  
}

.error-state {
    color: #ef4444; /* Vermelho para erro */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-title {
  margin: 0;
  font-size: 14px;
  color: #6b7280; /* Cinza médio */
}

.new-donation-button {
  background-color: #3b82f6; /* Azul */
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius:  5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-donation-button:hover {
  background-color: #2563eb; /* Azul escuro */
}

.plus-icon {
  margin-right: 5px;
  font-size: 20px;
  vertical-align: middle;

}

.search-input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
}
</style>