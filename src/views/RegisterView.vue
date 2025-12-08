<template>
  <div class="container">
    <div class="card">
      <div class="icon-container">💙</div>

      <h2>Criar Nova Conta</h2>
      <h3>Casa do Idoso - Sistema de Doações</h3>

      <form @submit.prevent="handleRegister">

        <!-- Nome -->
        <div class="form-group">
          <label>Nome de Usuário *</label>
          <input
            v-model="username"
            type="text"
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email *</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
          />
        </div>

        <!-- Função -->
        <div class="form-group">
          <label>Função *</label>
          <select v-model="role" required>
            <option disabled value="">Selecione uma função</option>
            <option value="administrador">Administrador</option>
            <option value="colaborador">Colaborador</option>
            <option value="voluntario">Voluntário</option>
          </select>
        </div>

        <!-- Senha -->
        <div class="form-group">
          <label>Senha *</label>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <!-- Confirmar Senha -->
        <div class="form-group">
          <label>Confirmar Senha *</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <button class="btn" type="submit">Criar Conta</button>
      </form>

      <p class="login">
        Já tem uma conta?
        <router-link to="/login">Faça login</router-link>
      </p>

      <p class="info">Preencha todos os campos para criar sua conta</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",

  data() {
    return {
      username: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    };
  },

  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }

      // monta a URL igual ao curl fornecido
      const url = `http://127.0.0.1:8000/auth/register?` +
        `name=${encodeURIComponent(this.username.trim())}` +
        `&email=${encodeURIComponent(this.email.trim())}` +
        `&password=${encodeURIComponent(this.password.trim())}` +
        `&funcao=${encodeURIComponent(this.role.trim())}`;

      try {
        const response = await fetch(url, {
          method: "POST",
        });

        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        if (!response.ok) {
          alert("Erro ao criar conta: " + text);
          return;
        }

        alert("Conta criada com sucesso!");
        this.$router.push("/login");

      } catch (error) {
        console.error("ERRO REGISTER:", error);
        alert("Erro de conexão com servidor.");
      }
    },
  },
};
</script>

<style scoped>
/* ===== GLOBAL ===== */
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5faff, #eef4ff);
}

/* ===== CARD ===== */
.card {
  background: white;
  width: 380px;
  padding: 35px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.icon-container {
  background: #3388ff;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
}

/* ===== TITLES ===== */
h2 {
  font-size: 18px;
  margin-bottom: 4px;
  color: #333;
  font-weight: 600;
}

h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
  font-weight: 400;
}

/* ===== FORM CONTROL ===== */
.form-group {
  text-align: center;
  margin-bottom: 15px;
  width: 100%;
}

.form-group label {
  display: block;
  width: 100%;
  font-size: 14px;
  color: #444;
  text-align: center;
  margin-bottom: 5px;
}

/* Inputs e Selects padrão 100% */
input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  font-size: 14px;
  background: #f8fafc;
  outline: none;
  transition: 0.2s;
  margin: 0 auto;
  box-sizing: border-box;
  display: block;
}

input:focus, select:focus {
  border-color: #3388ff;
  background: #ffffff;
}

/* ===== BUTTON ===== */
.btn {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  background: #3388ff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.2s;
}

.btn:hover {
  background: #1f6fe6;
}

/* ===== LINKS ===== */
.login {
  margin-top: 15px;
  font-size: 13px;
  color: #666;
}

.login a {
  color: #3388ff;
  text-decoration: none;
}

.login a:hover {
  text-decoration: underline;
}

/* Info */
.info {
  margin-top: 15px;
  font-size: 12px;
  color: #666;
}
</style>
