<template>
  <div class="layout">
    <Sidebar :active="'doadores'" @navigate="onNavigate" />

    <main class="main">
      <header class="header">
        <h2>Doadores</h2>
        <p class="subtitle">Lista de todos os doadores cadastrados</p>
      </header>

      <section class="box">
        <div class="box-header">
          <h3>Lista de Doadores</h3>
          <button class="add-btn" @click="$router.push('/doadores/novo')">
            + Novo Doador
          </button>
        </div>

        <!-- INPUT CENTRALIZADO -->
        <input
          class="search"
          type="text"
          v-model="search"
          placeholder="Pesquisar por nome ou email..."
        />

        <div v-if="loading" class="loading">Carregando doadores...</div>

        <div v-else class="cards-grid">
          <div class="card" v-for="doador in filtered" :key="doador.id">
            <h4>{{ doador.nome }}</h4>

            <p><span class="icon">📧</span> {{ doador.email }}</p>
            <p><span class="icon">📞</span> {{ doador.telefone }}</p>

            <p>
              <span class="icon">📅</span> Criado em:
              {{ formatDate(doador.created_at) }}
            </p>

            <!-- BOTÃO DELETAR -->
            <button class="delete-btn" @click="deleteDoador(doador.email)">
              Excluir
            </button>
          </div>
        </div>

        <p class="count">
          Mostrando {{ filtered.length }} doadores
        </p>
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/SideBar.vue";

export default {
  name: "DoadoresView",
  components: { Sidebar },

  data() {
    return {
      search: "",
      doadores: [],
      loading: false,
    };
  },

  computed: {
    filtered() {
      const t = this.search.toLowerCase();

      return this.doadores.filter(
        (d) =>
          (d.nome || "").toLowerCase().includes(t) ||
          (d.email || "").toLowerCase().includes(t)
      );
    },
  },

  methods: {
    async fetchDoadores() {
      this.loading = true;
      try {
        const response = await fetch("http://127.0.0.1:8000/donors/", {
          method: "GET",
        });

        if (!response.ok) {
          alert("Erro ao carregar doadores.");
          return;
        }

        const data = await response.json();
        this.doadores = data;

      } catch (err) {
        console.error("Erro ao buscar doadores:", err);
        alert("Erro de conexão com o servidor.");
      } finally {
        this.loading = false;
      }
    },

    async deleteDoador(email) {
      const confirmar = confirm(`Deseja realmente excluir o doador ${email}?`);
      if (!confirmar) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/donors/${encodeURIComponent(email)}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          alert("Erro ao excluir o doador.");
          return;
        }

        alert("Doador excluído com sucesso!");

        this.fetchDoadores(); // atualiza a lista

      } catch (err) {
        console.error("Erro ao excluir doador:", err);
        alert("Erro de conexão com o servidor.");
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return d.toLocaleDateString("pt-BR");
    },

    onNavigate(page) {
      if (page === "dashboard") this.$router.push("/dashboard");
      if (page === "doacoes") this.$router.push("/doacoes");
      if (page === "doadores") return;
      if (page === "aplicacoes") this.$router.push("/aplicacoes");
    },
  },

  mounted() {
    this.fetchDoadores();
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f7fbff;
  font-family: Inter, Arial, sans-serif;
}

.main {
  flex: 1;
  padding: 28px;
}

.header h2 {
  margin: 0;
  color: #113355;
}

.subtitle {
  color: #6f8aa0;
  margin-bottom: 20px;
}

/* BOX */
.box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e6eef8;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  background: #3388ff;
  color: white;
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

/* SEARCH CENTRALIZADO */
.search {
  width: 60%;
  margin: 15px auto;
  padding: 10px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  display: block;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #6f8aa0;
}

/* GRID */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 15px;
}

.card {
  background: #f8fbff;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid #e8eef6;
  position: relative;
}

.card h4 {
  margin: 0 0 10px 0;
  color: #23475a;
}

.icon {
  margin-right: 6px;
}

/* BOTÃO DELETAR */
.delete-btn {
  margin-top: 12px;
  background: #ff4d4d;
  color: white;
  padding: 8px 12px;
  width: 20%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.delete-btn:hover {
  background: #d93636;
}

.count {
  margin-top: 15px;
  color: #6f8aa0;
}
</style>
