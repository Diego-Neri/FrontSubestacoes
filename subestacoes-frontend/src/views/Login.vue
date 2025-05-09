<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="login-box">
        <h1>Login</h1>
        <form @submit.prevent="entrar">
          <div class="input-group">
            <label for="username">Usuário</label>
            <input id="username" type="text" placeholder="Digite seu usuário" />
          </div>
          <div class="input-group">
            <label for="password">Senha</label>
            <input id="password" type="password" placeholder="Digite sua senha" />
          </div>
          <div class="button-group">
            <button type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de sucesso -->
  <div v-if="isSuccess" class="modal-overlay">
    <div class="modal">
      <h2>Login realizado com sucesso!</h2>
      <p>Você será redirecionado em breve.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSuccess: false, 
    };
  },
  methods: {
    entrar() {
      this.isSuccess = true; 
      setTimeout(() => {
        this.isSuccess = false; 
        this.$router.push("/lista"); 
      }, 1000);
    },
    
  },
};
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
} 

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

/* Caixa de login */
.login-box {
  width: 100%;
  background: #ffffff; 
  border-radius: 8px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333; 
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: #007bff;
}

.button-group button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  /* background-color: #007bff;  */
  /* color: #fff; */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-group button:hover {
  background-color: #45a049; 
}

.button-group button:active {
  background-color: #45a049; 
}

/* Estilos do modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  color: #28a745;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal button:hover {
  background-color: #0056b3;
}

.modal button:active {
  background-color: #003f7f;
}

@media (max-width: 768px) {
  .login-box {
    padding: 1.5rem;
  }
}
</style>
