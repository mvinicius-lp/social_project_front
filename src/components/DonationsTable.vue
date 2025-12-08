<template>
  <div class="donation-table-container">
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
        <tr v-for="donation in donations" :key="donation.id">
          <td>{{ donation.date }}</td>
          <td>{{ donation.donor }}</td>
          <td>
            <span :class="['type-tag', getTypeClass(donation.type)]">
              {{ donation.type }}
            </span>
          </td>
          <td>{{ donation.description }}</td>
          
          <td class="text-right">
            R$ {{ donation.value || '0.00' }} 
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  donations: {
    type: Array,
    required: true
  }
});

// Mapeamento de classes CSS para os Tipos de Doação (baseado nas cores da imagem)
const typeMap = {
  'Dinheiro': 'type-money',
  'Alimentos': 'type-food',
  'Medicamentos': 'type-medicine',
  'Roupas': 'type-clothes',
  'Outros': 'type-other'
};

const getTypeClass = (type) => {
  return typeMap[type] || 'type-default';
};
</script>

<style scoped>
/* Estilização básica da tabela e tags */
.donation-table-container {
  overflow-x: auto;
}

table {
  width: 80%;
  border-collapse: collapse;
  /* Espaçamento vertical entre linhas */
  border-spacing: 2px  8px;
  /* Para parecer mais "limpo" como na imagem */
}

th {
  text-align: left;
  padding: 12px 16px;
  color: #6b7280; /* Cinza mais claro para o cabeçalho */
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px 16px;
  /* Cor e estilo da fonte das células de dados */
  color: #374151;
  font-weight: 400;
  border-bottom: 3px solid #f3f4f2;
}

/* Remove a borda superior do primeiro item para um look mais limpo */
tbody tr:first-child td {
    border-top: none;
}

.text-right {
  text-align: right;
}

/* Estilização das tags (Badges) */
.type-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

/* Cores das tags (adaptadas do screenshot) */
.type-money {
  background-color: #e0f2fe; /* Azul claro */
  color: #0b91e9;
}
.type-food {
  background-color: #ecfdf5; /* Verde menta */
  color: #10b981;
}
.type-medicine {
  background-color: #fee2e2; /* Vermelho/Rosa claro */
  color: #ef4444;
}
.type-clothes {
  background-color: #fef3c7; /* Amarelo claro */
  color: #f59e0b;
}
.type-other {
  background-color: #f3e8ff; /* Roxo claro */
  color: #8b5cf6;
}
.type-default {
  background-color: #e5e7eb;
  color: #6b7280;
}
</style>