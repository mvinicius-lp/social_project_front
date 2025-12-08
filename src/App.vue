
<template>
  <div id="app-layout">
    <Sidebar /> 
    <main class="content-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'; // Ajuste o caminho se necessário
// ...
</script>

<style>
/* Estilos Globais para o Layout */
#app-layout {
  display: flex;
  min-height: 100vh; /* Ocupa toda a altura da tela */
  background-color: #f9fafb; /* Cor de fundo principal */
}

.content-area {
  flex-grow: 1; /* Ocupa o restante do espaço */
  padding: 0; /* A view interna (DonationsView) gerencia o padding */
}

/* Você pode precisar de estilos adicionais para o body/html para remover margens */
</style>