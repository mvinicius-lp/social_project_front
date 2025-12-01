<template>
  <div class="container">
    <div class="card">
      <div class="icon-container">❤️</div>

      <h2>Solidarity Donations System</h2>
      <h3>Casa do Idoso</h3>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <button type="submit" class="btn">Entrar</button>
      </form>

      <p class="info">Cadastre-se</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        alert("Preencha email e senha!");
        return;
      }

      const url = `http://127.0.0.1:8000/auth/login?email=${encodeURIComponent(
        this.email.trim()
      )}&password=${encodeURIComponent(this.password.trim())}`;

      try {
        const response = await fetch(url, {
          method: "POST",
        });

        console.log("STATUS:", response.status);

        // Se não for 200, erro
        if (!response.ok) {
          alert("Credenciais inválidas.");
          return;
        }

        // 🔥 AGORA: usa json() direto
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Erro convertendo JSON:", jsonError);
          alert("Resposta inválida do servidor.");
          return;
        }

        console.log("JSON:", data);

        if (!data.access_token) {
          alert("Credenciais inválidas.");
          return;
        }

        localStorage.setItem("token", data.access_token);

        alert("Login realizado com sucesso!");
        // this.$router.push("/home");

      } catch (error) {
        console.error("ERRO NO FETCH:", error);
        alert("Erro de conexão com o servidor.");
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

.form-group {
  text-align: left;
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  color: #444;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
  background: #f8fafc;
}

input:focus {
  border-color: #3388ff;
  background: #ffffff;
}

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

.info {
  margin-top: 15px;
  font-size: 13px;
  color: #666;
}
</style>
