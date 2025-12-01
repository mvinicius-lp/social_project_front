<template>
  <div class="recent-card">
    <div class="head">
      <h3>Doações Recentes</h3>
      <p class="subtitle">Últimas doações recebidas</p>
    </div>

    <div v-if="loading" class="empty">Carregando...</div>
    <div v-else-if="!items.length" class="empty">Nenhuma doação ainda.</div>

    <ul v-else class="list">
      <li v-for="(d, idx) in items" :key="d.id ?? idx" class="item">
        <div class="info">
          <div class="name">{{ d.donorName }}</div>
          <div class="meta">{{ d.type }} - {{ d.description }}</div>
        </div>
        <div class="amount">
          <div class="value">{{ formatCurrency(d.amount) }}</div>
          <div class="date">{{ formatDate(d.date) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function formatCurrency(v){
  if (v == null) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}
function formatDate(iso){
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.recent-card{
  background:#fff;
  border:1px solid #eef4fa;
  border-radius:12px;
  padding:18px;
}
.head h3{ margin:0; color:#2b516e; }
.head .subtitle{ margin:6px 0 14px; color:#8fa6bb; font-size:13px; }

.list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
.item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:#f8fbfe;
  border-radius:8px;
  padding:14px;
  border:1px solid rgba(15,60,100,0.03);
}
.info{ max-width:70%; }
.name{ font-weight:600; color:#23475a; }
.meta{ color:#7f98a9; font-size:13px; margin-top:4px; }

.amount{ text-align:right; min-width:130px; }
.value{ color:#0c4a6e; font-weight:700; }
.date{ color:#9fb0c0; font-size:12px; margin-top:4px; }

.empty{ color:#8fa6bb; padding:12px; text-align:center; }
</style>
