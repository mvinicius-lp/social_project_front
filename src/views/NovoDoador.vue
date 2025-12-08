<template>
  <div class="layout">
    <Sidebar :active="'doadores'" @navigate="onNavigate" />

    <main class="main">

      <button class="back" @click="$router.push('/doadores')">← Voltar</button>

      <h2>Novo Doador</h2>
      <p class="subtitle">Cadastre um novo doador no sistema</p>

      <section class="box">
        <h3>Informações do Doador</h3>
        <p class="desc">Preencha os campos abaixo para cadastrar o doador</p>

        <form @submit.prevent="handleSubmit" class="form">

          <div class="form-group">
            <label>Nome Completo *</label>
            <input
              v-model="nome"
              type="text"
              placeholder="Ex.: Maria Fernanda Silva"
              required
            />
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input
              v-model="email"
              type="email"
              placeholder="Ex.: maria.silva@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Telefone *</label>
            <input
              v-model="telefone"
              type="text"
              placeholder="Ex.: (11) 98765-4321"
              required
            />
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input
              v-model="endereco"
              type="text"
              placeholder="Ex.: Rua das Flores, 120 - Centro - São Paulo"
            />
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea
              v-model="obs"
              placeholder="Ex.: Doador frequente, prefere contato por email..."
            ></textarea>
          </div>

          <div class="actions">
            <button type="button" class="cancel" @click="$router.push('/doadores')">
              Cancelar
            </button>
            <button class="submit-btn" type="submit">
              Cadastrar Doador
            </button>
          </div>

        </form>
      </section>

    </main>
  </div>
</template>

<script>
import Sidebar from "../components/SideBar.vue";

export default {
  name: "NovoDoador",
  components: { Sidebar },

  data() {
    return {
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      obs: "",
    };
  },

  methods: {
    async handleSubmit() {
      try {
        const payload = {
          nome: this.nome.trim(),
          email: this.email.trim(),
          telefone: this.telefone.trim(),
          endereco: this.endereco.trim(),
          obs: this.obs.trim(),
        };

        const response = await fetch("http://127.0.0.1:8000/donors/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          alert("Erro ao cadastrar o doador.");
          return;
        }

        alert("Doador cadastrado com sucesso!");
        this.$router.push("/doadores");

      } catch (error) {
        console.error("Erro ao conectar ao servidor:", error);
        alert("Erro de conexão com o backend.");
      }
    },

    onNavigate(page) {
      if (page === "doadores") this.$router.push("/doadores");
    },
  },
};
</script>

<style scoped>
/* ===== Layout geral ===== */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f7fbff;
  font-family: Inter, Arial, sans-serif;
}

.main {
  flex: 1;
  padding: 32px 40px;
}

/* ===== Cabeçalho ===== */
.back {
  background: none;
  border: none;
  color: #446b9e;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 15px;
}

h2 {
  margin: 0;
  color: #113355;
}

.subtitle {
  color: #6f8aa0;
  margin-bottom: 20px;
}

/* ===== Box ===== */
.box {
  background: #fff;
  padding: 25px;
  border: 1px solid #e6eef8;
  border-radius: 12px;
  width: 65%;
  margin: 0 auto;
  text-align: center;
}

.desc {
  color: #7b8fa1;
  margin-bottom: 20px;
  font-size: 14px;
}

/* ===== Form ===== */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.form-group {
  width: 80%;
  text-align: left;
}

label {
  margin-bottom: 6px;
  color: #455b73;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #dce1e8;
  background: #f8fafc;
  font-size: 14px;
  outline: none;
  display: block;
  margin: 0 auto;
}

textarea {
  height: 90px;
  resize: none;
}

input:focus,
textarea:focus {
  border-color: #3388ff;
  background: #ffffff;
}

/* ===== Botões ===== */
.actions {
  width: 80%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.cancel {
  background: #e7edf7;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  color: #355276;
}

.submit-btn {
  background: #3388ff;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.submit-btn:hover {
  background: #1f6fe6;
}
</style>
