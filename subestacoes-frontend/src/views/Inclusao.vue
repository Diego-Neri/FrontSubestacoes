<template>
  <div class="container">
    <!-- Formulário Subestação -->
     <h1>Incluir</h1>
    <div class="form-wrapper">
      <form @submit.prevent="incluirSubestacao">
        <h2>Subestação</h2>
        <!-- Campos da Subestação -->
        <div class="input-group">
          <label for="codigo-subestacao">Código:</label>
          <input id="codigo-subestacao" v-model="codigoSubestacao" type="text" maxlength="3" placeholder="Digite o código (máx. 3 caracteres)" @input="validarCodigoSubestacao" required />
          <p v-if="erroCodigoSubestacao" class="error-message">{{ erroCodigoSubestacao }}</p>
        </div>
        <div class="input-group">
          <label for="nome-subestacao">Nome:</label>
          <input id="nome-subestacao" v-model="nomeSubestacao" type="text" maxlength="100" placeholder="Digite o nome (máx. 100 caracteres)" @input="validarNomeSubestacao" required />
          <p v-if="erroNomeSubestacao" class="error-message">{{ erroNomeSubestacao }}</p>
        </div>
        <div class="input-group">
          <label for="latitude">Latitude:</label>
          <input id="latitude" v-model="latitude" type="text" placeholder="Digite a latitude" required />
        </div>
        <div class="input-group">
          <label for="longitude">Longitude:</label>
          <input id="longitude" v-model="longitude" type="text" placeholder="Digite a longitude" required />
        </div>
      </form>
    </div>
  </div>

  <div class="container-2">
    <div class="form-wrapper">
      <h2>Rede MT</h2>

      <!-- Campos para adicionar uma nova rede -->
      <div class="input-group">
        <label for="novoCodigo">Código:</label>
        <input id="novoCodigo" type="text" v-model="novoCodigo" maxlength="5" placeholder="Máx. 5 caracteres" @input="validarCodigoRedeMT" required />
        <p v-if="erroCodigoRedeMT" class="error-message">{{ erroCodigoRedeMT }}</p>
      </div>
      <div class="input-group">
        <label for="novoNome">Nome:</label>
        <input id="novoNome" type="text" v-model="novoNome" maxlength="100" placeholder="Máx. 100 caracteres" @input="validarNomeRedeMT" required />
        <p v-if="erroNomeRedeMT" class="error-message">{{ erroNomeRedeMT }}</p>
      </div>
      <div class="input-group">
        <label for="novaTensao">Tensão Nominal:</label>
        <input id="novaTensao" type="text" v-model="novaTensao" placeholder="Informe a tensão" @input="validarTensaoNominal" required />
        <p v-if="erroTensaoNominal" class="error-message">{{ erroTensaoNominal }}</p>
      </div>
      <div>
        <button class="add-btn" @click="adicionarRedeMT">Adicionar Rede MT</button>
      </div>

      <!-- Tabela das redes MT -->
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Tensão Nominal</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rede, index) in redesMT" :key="index">
            <td>
              {{ rede.codigo }}
            </td>
            <td>
              {{ rede.nome }}
            </td>
            <td>
              {{ rede.tensaoNominal }}
            </td>
            <td>
              <button class="action-btn delete" @click="excluirRedeMT(index)">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="container-4">
    <div class="form-actions">
      <button type="button" class="submit-btn" @click="efetivarAlteracoes">Efetivar inclusão</button>
      <button type="button" class="cancel-btn" @click="cancelar">Cancelar inclusão</button>
    </div>
  </div>

  <div v-if="isSuccess" class="modal-overlay">
    <div class="modal">
      <h2>Inclusão realizada com sucesso!</h2>
      <p>Você será redirecionado em breve.</p>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      codigoSubestacao: '',
      nomeSubestacao: '',
      latitude: '',
      longitude: '',
      redesMT: [],
      novoCodigo: '', 
      novoNome: '', 
      novaTensao: '',
      mensagem: '',
      isSuccess: false,

      
      erroCodigoSubestacao: '',
      erroNomeSubestacao: '',
      erroCodigoRedeMT: '',
      erroNomeRedeMT: '',
      erroTensaoNominal: '',
    };
  },
  methods: {
    validarCodigoSubestacao() {
      this.erroCodigoSubestacao =
        this.codigoSubestacao.length > 3 ? "Máximo de 3 caracteres permitidos." : "";
    },
    validarNomeSubestacao() {
      this.erroNomeSubestacao =
        this.nomeSubestacao.length > 100 ? "Máximo de 100 caracteres permitidos." : "";
    },
    validarCodigoRedeMT() {
      this.erroCodigoRedeMT =
        this.novoCodigo.length > 5 ? "Máximo de 5 caracteres permitidos." : "";
    },
    validarNomeRedeMT() {
      this.erroNomeRedeMT =
        this.novoNome.length > 100 ? "Máximo de 100 caracteres permitidos." : "";
    },
    validarTensaoNominal() {
      if (isNaN(this.novaTensao)) {
        this.erroTensaoNominal = "A tensão nominal deve conter apenas números.";
      } else {
        this.erroTensaoNominal = "";
      }
    },
    adicionarRedeMT() {
      
      this.validarCodigoRedeMT();
      this.validarNomeRedeMT();
      this.validarTensaoNominal();

      if (this.erroCodigoRedeMT || this.erroNomeRedeMT || this.erroTensaoNominal) {
        this.mensagem = "Por favor, corrija os erros antes de adicionar a rede.";
        return;
      }

      
      if (this.redesMT.some((rede) => rede.codigo === this.novoCodigo)) {
        this.erroCodigoRedeMT = "Já existe uma rede com este código.";
        return;
      }

      
      this.redesMT.push({
        codigo: this.novoCodigo,
        nome: this.novoNome,
        tensaoNominal: this.novaTensao,
      });

      // Reseta os campos para nova entrada
      this.novoCodigo = '';
      this.novoNome = '';
      this.novaTensao = '';
      this.erroCodigoRedeMT = '';
      this.erroNomeRedeMT = '';
      this.erroTensaoNominal = '';
      this.mensagem = "Rede adicionada com sucesso!";
    },
    excluirRedeMT(index) {
      this.redesMT.splice(index, 1);
    },
    async efetivarAlteracoes() {
  // Validação local da subestação
  this.validarCodigoSubestacao();
  this.validarNomeSubestacao();

  // Validação local das redes MT
  let redesComErro = false;
  this.redesMT.forEach((rede) => {
    if (!rede.codigo || rede.codigo.length > 5) {
      this.erroCodigoRedeMT = "Código da rede MT inválido (máximo 5 caracteres).";
      redesComErro = true;
    }
    if (!rede.nome || rede.nome.length > 100) {
      this.erroNomeRedeMT = "Nome da rede MT inválido (máximo 100 caracteres).";
      redesComErro = true;
    }
    if (isNaN(rede.tensaoNominal)) {
      this.erroTensaoNominal = "A tensão nominal deve conter apenas números.";
      redesComErro = true;
    }
  });

  // Interrompe se houver erro local
  if (this.erroCodigoSubestacao || this.erroNomeSubestacao || redesComErro) {
    this.mensagem = "Corrija os erros antes de salvar.";
    return;
  }

  // Verificação no backend: Subestação
  try {
    const response = await axios.get(
      `http://localhost:8080/api/Subestacao/${this.codigoSubestacao}`
    );
    if (response.data) {
      this.erroCodigoSubestacao = "Já existe uma subestação com este código.";
      this.mensagem = "Erro: código de subestação já cadastrado.";
      return;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Código não existe, pode prosseguir
    } else {
      console.error("Erro ao verificar código da subestação:", error);
      this.mensagem = "Erro ao verificar o código da subestação.";
      return;
    }
  }

  // Verificação no backend: Redes MT
  for (const rede of this.redesMT) {
    try {
      const response = await axios.get(`http://localhost:8080/api/Rede/${rede.codigo}`);
      if (response.data) {
        this.erroCodigoRedeMT = `A rede MT com o código ${rede.codigo} já existe.`;
        this.mensagem = "Erro: código de rede MT já cadastrado.";
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        
      } else {
        console.error("Erro ao verificar código da rede MT:", error);
        this.mensagem = "Erro ao verificar o código da rede MT.";
        return;
      }
    }
  }

  // Envia os dados ao backend apenas se todas as validações passarem
  try {
    const subestacao = {
      codigo: this.codigoSubestacao,
      nome: this.nomeSubestacao,
      latitude: parseFloat(this.latitude),
      longitude: parseFloat(this.longitude),
    };

    // Cria a subestação
    const subestacaoResponse = await axios.post(
      "http://localhost:8080/api/Subestacao",
      subestacao
    );

    const subestacaoId = subestacaoResponse.data?.id;
    if (!subestacaoId) {
      throw new Error("Falha ao criar a subestação. ID não retornado.");
    }

    // Cria as redes MT relacionadas
    for (const rede of this.redesMT) {
      const redeMT = {
        codigo: rede.codigo,
        nome: rede.nome,
        tensaoNominal: rede.tensaoNominal,
        subestacao: { id: subestacaoId },
      };

      console.log("Dados enviados para a rede MT:", redeMT);
      await axios.post("http://localhost:8080/api/Rede", redeMT);
    }

    this.mensagem = "Alterações salvas com sucesso!";
    this.isSuccess = true;

    setTimeout(() => {
      this.isSuccess = false;
      this.$router.push("/lista");
    }, 1000);

  } catch (error) {
    this.mensagem =
      error.response?.data?.message || "Erro desconhecido ao salvar alterações.";
    console.error(error);
  }
},
    cancelar() {
      this.$router.push("/lista");
    },
  },
};
</script>





<style scoped>
.container,
.container-2,
.container-4 {
  padding: 20px;
  background: #fff;
  border: 1px solid #ccc;
  width: 80%;
  margin: 20px auto;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.form-wrapper {
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

input {
  padding: 5px;
  border: 1px solid #aaa;
  font-size: 14px;
  background-color: #fefefe;
}

button {
  padding: 5px 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background-color: #bbb;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  margin-top: 10px;
}

.add-btn:hover {
  background-color: #45a049;
}

/* .cancel-btn {
  background-color: #f44336;
  color: white;
} */

.cancel-btn:hover {
  background-color: #e53935;
}

/* .submit-btn {
  background-color: #4CAF50;
  color: white;
} */

.submit-btn:hover {
  background-color: #45a049;
}

.action-btn {
  background-color: #f44336;
  color: white;
  padding: 5px;
}

.action-btn:hover {
  background-color: #e53935;
}

@media (max-width: 768px) {
  .container {
    width: 95%;
  }

  button {
    width: 100%;
    margin-top: 5px;
  }
}

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

.error-message {
  color: red;
  font-size: 0.9em;
}
</style>
