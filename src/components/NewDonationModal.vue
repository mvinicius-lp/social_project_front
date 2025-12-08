<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      
      <div class="modal-header">
        <h3>Adicionar Nova Doação</h3>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="handleSubmit">
        
        <div class="form-group">
          <label for="donor">Doador</label>
          <input 
            type="text" 
            id="donor" 
            v-model="newDonation.donor" 
            required
          />
        </div>

        <div class="form-group">
          <label for="date">Data</label>
          <input 
            type="date" 
            id="date" 
            v-model="newDonation.date" 
            required
          />
        </div>

        <div class="form-group">
          <label for="type">Tipo</label>
          <select id="type" v-model="newDonation.type" required>
            <option disabled value="">Selecione um tipo</option>
            <option v-for="type in donationTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea 
            id="description" 
            v-model="newDonation.description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="value">Valor (R$)</label>
          <input 
            type="number" 
            id="value" 
            v-model.number="newDonation.value" 
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-cancel" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn-save">
            Salvar Doação
          </button>
        </div>
      </form>
      
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['close', 'add-donation']);

const donationTypes = ['Dinheiro', 'Alimentos', 'Medicamentos', 'Roupas', 'Outros'];

// Estado inicial do formulário para a nova doação
const newDonation = ref({
  donor: '',
  date: new Date().toISOString().split('T')[0], // Data de hoje por padrão
  type: '',
  description: '',
  value: null,
});

const handleSubmit = () => {
  if (!newDonation.value.donor || !newDonation.value.type || !newDonation.value.value) {
    alert('Por favor, preencha todos os campos obrigatórios (Doador, Tipo e Valor).');
    return;
  }
  
  // Formatando o objeto a ser emitido. 
  // O ID deve ser gerado no componente pai (DonationView) ou pelo Backend.
  const donationToAdd = {
    ...newDonation.value,
    value: parseFloat(newDonation.value.value), // Garante que o valor é um número
  };
  
  emits('add-donation', donationToAdd);
  
  // O componente pai será responsável por fechar o modal.
};
</script>

<style scoped>
/* Estilização do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
}

/* Estilização do Formulário */
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #374151;
}

input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box; /* Garante que o padding não aumente o tamanho final */
}

textarea {
    resize: vertical;
    min-height: 80px;
}

/* Ações e Botões */
.modal-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-save {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-save:hover {
  background-color: #2563eb;
}
</style>