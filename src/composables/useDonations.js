// src/composables/useDonations.js

import { ref, readonly } from 'vue';

const API_URL = 'http://localhost:3000/donations';

// Estado global do módulo (se quiser que seja um singleton)
const donations = ref([]);
const isLoading = ref(false);
const error = ref(null);

export function useDonations() {
  
  // Função para carregar os dados da API
  const fetchDonations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ordena por data (mais recente primeiro)
      donations.value = data.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    } catch (err) {
      console.error("Erro ao buscar doações:", err);
      error.value = 'Falha ao carregar as doações.';
    } finally {
      isLoading.value = false;
    }
  };

  // Função para adicionar uma nova doação via API (POST)
  const addDonation = async (newDonation) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDonation),
      });

      if (!response.ok) {
        throw new Error('Falha ao adicionar doação.');
      }

      const addedDonation = await response.json();
      
      // Adiciona o item recém-criado (com ID do backend) ao estado local e reordena
      donations.value.unshift(addedDonation);
      
      return addedDonation;

    } catch (err) {
      console.error("Erro ao adicionar doação:", err);
      error.value = 'Falha na comunicação com o servidor ao salvar.';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Retorna o estado reativo e as funções
  return {
    donations: readonly(donations), // Protege a mutação direta
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchDonations,
    addDonation,
  };
}