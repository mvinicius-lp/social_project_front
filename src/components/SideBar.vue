<template>
  <aside class="sidebar">
    <div>
      <div class="brand">
        <div class="logo">🏠</div>
        <div>
          <h3>Casa do Idoso</h3>
          <small>Sistema de Doações</small>
        </div>
      </div>

      <nav class="nav">

        <!-- DASHBOARD -->
        <button
          class="nav-item"
          :class="{ active: active === 'dashboard' }"
          @click="navigate('dashboard')"
        >
          Dashboard
        </button>

        <!-- DOAÇÕES -->
        <button
          class="nav-item"
          :class="{ active: active === 'doacoes' }"
          @click="navigate('doacoes')"
        >
          Doações
        </button>

        <!-- DOADORES -->
        <button
          class="nav-item"
          :class="{ active: active === 'doadores' }"
          @click="navigate('doadores')"
        >
          Doadores
        </button>

        <!-- APLICAÇÕES -->
        <button
          class="nav-item"
          :class="{ active: active === 'aplicacoes' }"
          @click="navigate('aplicacoes')"
        >
          Aplicações
        </button>

      </nav>
    </div>

    <!-- botão Sair -->
    <div class="footer">
      <button class="logout" @click="$emit('logout')">
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </span>
        <span class="label">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";

defineProps({
  active: { type: String, default: "dashboard" },
});

const emit = defineEmits(["navigate", "logout"]);
const router = useRouter();

/**
 * Handler único para navegar
 * - Emite evento para telas que usam <Sidebar @navigate="...">
 * - Faz push direto caso queira usar navegação automática
 */
function navigate(page) {
  emit("navigate", page); // mantém compatibilidade com seu DashBoard atual

  // Navegação direta pelo router 
  if (page === "dashboard") router.push({ name: "dashboard" });
  if (page === "doadores") router.push({ name: "doadores" });
  if (page === "doacoes") router.push({ name: "doacoes" }); 
  if (page === "aplicacoes") router.push({ name: "aplicacoes" }); // placeholder
}
</script>

<style scoped>
.sidebar{
  width: 220px;
  min-height: 100vh;
  padding: 20px;
  border-right: 1px solid #e6eef8;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand{ display:flex; gap:12px; align-items:center; margin-bottom:18px; }
.logo{ font-size:28px; }
.brand h3{ margin:0; font-size:16px; color:#0b4da2; }
.brand small{ color:#8b9ab4; display:block; }

.nav{ display:flex; flex-direction:column; gap:8px; margin-top:6px; }
.nav-item{
  background:none;
  border:none;
  text-align:left;
  padding:10px 12px;
  border-radius:8px;
  cursor:pointer;
  color:#385971;
  width:100%;
}
.nav-item.active{ background:#eef6ff; color:#0b4da2; font-weight:600; }
.nav-item:hover{ background:#f7fbff; }

.footer{ margin-top: 12px; }
.logout{
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  padding:10px 12px;
  border-radius:8px;
  border:1px solid #e6eef8;
  background:#fff;
  cursor:pointer;
  color:#1e3a8a;
  font-weight:600;
}
.logout:hover{
  background:#f1f8ff;
  border-color:#dbeeff;
}
.icon{ display:flex; align-items:center; }
.label{ line-height:1; }
</style>
