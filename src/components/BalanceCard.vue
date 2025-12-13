<template>
  <div class="balance-card">
    <div class="header">
      <div>
        <h4>Saldo Disponível</h4>
        <p class="subtitle">
          Disponível para aplicação em projetos e necessidades da Casa do Idoso
        </p>
      </div>
      <span class="icon">💳</span>
    </div>

    <div class="saldo">
      {{ formatCurrency(saldoDisponivel) }}
    </div>

    <div class="divider"></div>

    <div class="totals">
      <div class="row">
        <span>Total arrecadado:</span>
        <strong>{{ formatCurrency(totalArrecadado) }}</strong>
      </div>
      <div class="row">
        <span>Total aplicado:</span>
        <strong>{{ formatCurrency(totalAplicado) }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalArrecadado: { type: Number, required: true },
  totalAplicado: { type: Number, required: true }
})

const saldoDisponivel = computed(() => {
  return props.totalArrecadado - props.totalAplicado
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.balance-card {
  background: #f0faff;
  border: 1px solid #d9ecff;
  border-radius: 14px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header h4 {
  margin: 0;
  color: #1f4fd8;
}

.subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #6b88a6;
}

.icon {
  font-size: 22px;
}

.saldo {
  margin: 18px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.divider {
  height: 1px;
  background: #dbeafe;
  margin: 14px 0;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #334155;
}
</style>
