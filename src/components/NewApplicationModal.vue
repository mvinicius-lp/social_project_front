<template>
  <div class="modal-overlay">
    <div class="modal">

      <div class="modal-header">
        <h3>Nova Aplicação</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="modal-body">

        <!-- DATA -->
        <div class="form-group">
          <label>Data</label>
          <input type="date" v-model="form.date" />
        </div>

        <!-- LISTA DE DOADORES -->
        <div class="form-group">
          <label>Doador(es)</label>

          <div class="donor-list">
            <div
              v-for="d in donors"
              :key="d.nome"
              class="donor-item"
            >
              <input
                type="checkbox"
                :value="d"
                v-model="selectedDonors"
                @change="updateDonations"
              />
              <span>{{ d.nome }} — R$ {{ d.value }}</span>
            </div>
          </div>

          <small style="color:#64748b; margin-top:4px;">
            Clique para selecionar ou remover
          </small>
        </div>

        <!-- ÁREA -->
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

        <!-- DESCRIÇÃO -->
        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.description"></textarea>
        </div>

        <!-- VALOR TOTAL (APENAS VISUAL) -->
        <div class="form-group">
          <label>Valor Aplicado (R$)</label>
          <input type="number" :value="totalAmount" readonly />
        </div>

      </div>

      <!-- FOOTER -->
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
import { reactive, ref, onMounted, computed } from 'vue'

const emit = defineEmits(['close', 'submit-success'])

/* FORM — CONTRATO NOVO */
const form = reactive({
  date: '',
  area: '',
  description: '',
  donations: []   // <-- ENVIO REAL PARA BACKEND
})

const donors = ref([])
const selectedDonors = ref([])

/* BUSCA DOADORES */
onMounted(async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/donors/with-values")
    if (!res.ok) throw new Error("Erro ao buscar doadores.")
    donors.value = await res.json()
  } catch (err) {
    console.error("Erro ao carregar doadores:", err)
  }
})

/* TOTAL APENAS PARA EXIBIÇÃO */
const totalAmount = computed(() => {
  return selectedDonors.value.reduce(
    (sum, d) => sum + Number(d.value || 0),
    0
  )
})

/* MONTA donations[] PARA BACKEND */
const updateDonations = () => {
  form.donations = selectedDonors.value.map(d => ({
    donor: d.nome,
    amount: Number(d.value)
  }))
}

/* SUBMIT */
const submit = async () => {
  if (!form.date || !form.area || form.donations.length === 0) {
    alert("Preencha todos os campos e selecione ao menos 1 doador.")
    return
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/applications/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: form.date,
        area: form.area,
        description: form.description,
        donations: form.donations
      })
    })

    if (!response.ok) {
      const err = await response.json()
      alert(err.detail || "Erro ao salvar a aplicação.")
      return
    }

    alert("Aplicação registrada com sucesso!")
    emit("submit-success")
    emit("close")

  } catch (error) {
    console.error("Erro ao enviar aplicação:", error)
    alert("Erro de comunicação com o servidor.")
  }
}
</script>

<style scoped>
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

.modal-footer {
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

.donor-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  max-height: 145px;
  overflow-y: auto;
}

.donor-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-secondary {
  background: #898998;
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
