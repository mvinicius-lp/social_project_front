<template>
  <div class="modal-overlay">
    <div class="modal">

      <div class="modal-header">
        <h3>Nova Aplicação</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Data</label>
          <input type="date" v-model="form.date" />
        </div>

        <div class="form-group">
          <label>Doador</label>
          <input type="text" v-model="form.donor" />
        </div>

        <div class="form-group">
          <label>Doação Original</label>
          <input type="text" v-model="form.originalDonation" />
        </div>

        <div class="form-group">
          <label>Área</label>
          <select v-model="form.area">
            <option disabled value="">Selecione</option>
            <option>Alimentação</option>
            <option>Medicamentos</option>
            <option>Suplementos</option>
            <option>Manutenção</option>
            <option>Atividades</option>
            <option>Pessoal</option>
          </select>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.description"></textarea>
        </div>

        <div class="form-group">
          <label>Valor Aplicado (R$)</label>
          <input type="number" v-model="form.amount" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn-primary" @click="submit">
          Salvar
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  date: '',
  donor: '',
  originalDonation: '',
  area: '',
  description: '',
  amount: null,
})

const resetForm = () => {
  Object.keys(form).forEach(key => form[key] = '')
  form.amount = null
}

const submit = () => {
  if (!form.date || !form.donor || !form.area || !form.amount) return

  emit('submit', { ...form })
  resetForm()
}
</script>

<style scoped>
/* mesmo CSS do modal anterior */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 480px;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  padding: 16px;
  background: #f9fafb;
  display: flex;
  justify-content: space-between; 
  border-bottom: 1px solid #e5e7eb;
}

.modal-footer{
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
}

.modal-body {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 13px;
  color: #64748b;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}


textarea {
  resize: none;
}

.btn-secondary {
  background: #898998 ;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background: #2E6F40;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
