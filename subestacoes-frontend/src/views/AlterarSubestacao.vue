<template>
  <div class="container">
    <h1>Alterar</h1>
    
    <!-- Formulário de Subestação -->
    <div v-if="subestacao">
      <form @submit.prevent="salvarAlteracoes">
        <h2>Subestação</h2>

        <div class="input-group">
          <label for="codigo-subestacao">Código:</label>
          <input v-model="subestacao.codigo" id="codigo-subestacao" type="text" maxlength="3" disabled />
          <p v-if="erroCodigoSubestacao" class="error-message">{{ erroCodigoSubestacao }}</p>
        </div>

        <div class="input-group">
          <label for="nome-subestacao">Nome:</label>
          <input v-model="subestacao.nome" id="nome-subestacao" type="text" maxlength="100" placeholder="Digite o nome" required />
          <p v-if="erroNomeSubestacao" class="error-message">{{ erroNomeSubestacao }}</p>
        </div>

        <div class="input-group">
          <label for="latitude">Latitude:</label>
          <input v-model="subestacao.latitude" id="latitude" type="text" placeholder="Digite a latitude" required />
        </div>

        <div class="input-group">
          <label for="longitude">Longitude:</label>
          <input v-model="subestacao.longitude" id="longitude" type="text" placeholder="Digite a longitude" required />
        </div>
      </form>
    </div>
    
    <!-- Tabela de Redes MT -->
    <div class="form-wrapper">
      <h2>Redes MT</h2>

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

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Tensão Nominal</th>
            <th>Editar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rede, index) in redesMT" :key="rede.id">
            <td>{{ rede.codigo }}</td>
            <td>{{ rede.nome }}</td>
            <td>{{ rede.tensaoNominal }}</td>
            <td>
              <button @click="editarRedeMT(index)" class="edit-btn">✏️</button>
            </td>
            <td>
              <button @click="excluirRedeMT(index)" class="action-btn" :class="{ 'disabled': rede.excluir }">
                {{ rede.excluir ? '❌' : '🗑️' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Edição de Rede MT -->
      <ul>
        <li v-for="(rede, index) in redesMT" :key="rede.id">
          <div v-if="rede.editar" class="edit-rede">
            <input v-model="rede.codigo" type="text" maxlength="5" placeholder="Máx. 5 caracteres" disabled/>
            <input v-model="rede.nome" type="text" maxlength="100" placeholder="Máx. 100 caracteres" />
            <input v-model="rede.tensaoNominal" type="number" placeholder="Informe a tensão" />
            <!-- <button @click="salvarAlteracaoRede(index)" class="save-btn">Salvar</button> -->
          </div>
          
        </li>
      </ul>
    </div>

    <!-- Botões de Ação -->
    <div class="form-actions">
      <button @click="salvarAlteracoes" class="submit-btn">Efetuar Alterações</button>
      <button @click="cancelar" class="cancel-btn">Cancelar</button>
    </div>

        <!-- Modal de Sucesso -->
    <div v-if="isSuccess" class="modal-overlay">
      <div class="modal success">
        <h2>Alterações realizadas com sucesso!</h2>
        <p>Você será redirecionado em breve.</p>
      </div>
    </div>

    <!-- Modal de Erro -->
    <div v-if="isError" class="modal-overlay">
      <div class="modal error">
        <h2>Ocorreu um erro!</h2>
        <p>{{ errorMessage }}</p>
        <button @click="fecharErro" class="close-btn">Fechar</button>
      </div>
    </div>

  </div>
  
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { defineComponent, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "AlterarSubestacao",
  data() {
    return {
      subestacao: null as any,
      redesMT: [] as any[],
      isSuccess: false,
      isError: false, 
      errorMessage: '', 
      erroCodigoSubestacao: '',
      erroNomeSubestacao: '',
      novoCodigo: '',
      novoNome: '',
      novaTensao: '',
      erroCodigoRedeMT: '',
      erroNomeRedeMT: '',
      erroTensaoNominal: '',
    };
  },
  created() {
    this.carregarDadosSubestacao();
  },
  methods: {
    validarCodigoRedeMT() {
      this.erroCodigoRedeMT =
        this.novoCodigo.length > 5 ? "Máximo de 5 caracteres permitidos." : "";
    },
    validarNomeRedeMT() {
      this.erroNomeRedeMT =
        this.novoNome.length > 100 ? "Máximo de 100 caracteres permitidos." : "";
    },
    validarTensaoNominal() {
      const tensao = Number(this.novaTensao);
      if (isNaN(tensao)) {
        this.erroTensaoNominal = "A tensão nominal deve conter apenas números.";
      } else if (tensao <= 0) {
        this.erroTensaoNominal = "A tensão nominal deve ser maior que zero.";
      } else {
        this.erroTensaoNominal = "";
      }
    },
    async carregarDadosSubestacao() {
      const route = useRoute();
      const codigo = route.params.codigo;

      try {
        const response = await axios.get(`http://localhost:8080/api/Subestacao/${codigo}`);
        this.subestacao = response.data;

        if (this.subestacao && this.subestacao.redes) {
          this.redesMT = this.subestacao.redes.map((rede: any) => ({
            id: rede.id,
            codigo: rede.codigo,
            nome: rede.nome,
            tensaoNominal: rede.tensaoNominal,
            excluir: false,
            editar: false,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da subestação:", error);
        this.exibirErro("Erro ao carregar os dados da subestação.");
      }
    },
    editarRedeMT(index: number) {
      this.redesMT[index].editar = !this.redesMT[index].editar;
    },
    excluirRedeMT(index: number) {
    
    const confirmacao = window.confirm('Tem certeza que deseja excluir');
    
    if (confirmacao) {
      
      this.redesMT[index].excluir = true;
    }
  },
  async salvarAlteracoes() {
    const errors: string[] = [];

      try {
        
        try {
          await axios.put(`http://localhost:8080/api/Subestacao/${this.subestacao.codigo}`, {
            nome: this.subestacao.nome,
            latitude: this.subestacao.latitude,
            longitude: this.subestacao.longitude,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(`Erro ao atualizar subestação: ${errorMessage}`);
          throw error;
        }

       
        const redesParaExcluir = this.redesMT.filter(rede => rede.excluir);
        for (const rede of redesParaExcluir) {
          try {
            const response = await axios.delete(`http://localhost:8080/api/Rede/${rede.codigo}`);
            if (response.status !== 200) {
              errors.push(`Falha ao excluir rede ${rede.codigo}`);
            }
          } catch (deleteError: unknown) {
            const errorMessage = deleteError instanceof Error ? deleteError.message : String(deleteError);
            errors.push(`Erro ao excluir rede ${rede.codigo}: ${errorMessage}`);
          }
        }

        
        for (const rede of this.redesMT) {
          if (rede.editar && !rede.excluir) {
            try {
              await axios.put(`http://localhost:8080/api/Rede/${rede.codigo}`, {
                nome: rede.nome,
                tensaoNominal: rede.tensaoNominal,
              });
            } catch (updateError: unknown) {
              const errorMessage = updateError instanceof Error ? updateError.message : String(updateError);
              errors.push(`Erro ao atualizar rede ${rede.codigo}: ${errorMessage}`);
            }
          }
        }

       
        const redesNovas = this.redesMT.filter(rede => rede.novo);
        for (const novaRede of redesNovas) {
          try {
            await axios.post('http://localhost:8080/api/Rede', {
              codigo: novaRede.codigo,
              nome: novaRede.nome,
              tensaoNominal: novaRede.tensaoNominal,
              subestacao: { id: this.subestacao.id },
            });
          } catch (addError: unknown) {
            const errorMessage = addError instanceof Error ? addError.message : String(addError);
            errors.push(`Erro ao adicionar nova rede ${novaRede.codigo}: ${errorMessage}`);
          }
        }

        
        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }

        
        this.redesMT = this.redesMT.filter(rede => !rede.excluir);

        this.isSuccess = true;
        setTimeout(() => {
          this.$router.push("/Lista");
        }, 2000);
      } catch (error: unknown) {
        console.error("Erro ao salvar alterações:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.exibirErro(errorMessage || "Erro ao salvar as alterações. Tente novamente.");
        this.isError = true;
      }
  },
    exibirErro(mensagem: string) {
      this.errorMessage = mensagem;
      this.isError = true;
    },
    fecharErro() {
      this.isError = false;
      this.errorMessage = '';
    },
    adicionarRedeMT() {
      if (!this.novoCodigo || this.novoCodigo.length > 5) {
        this.erroCodigoRedeMT = "Código inválido (máximo 5 caracteres)";
        return;
      }

      const redeExistente = this.redesMT.find(r => r.codigo === this.novoCodigo);
      if (redeExistente) {
        this.erroCodigoRedeMT = "Código de rede já existe";
        return;
      }

      if (!this.novoNome || this.novoNome.length > 100) {
        this.erroNomeRedeMT = "Nome inválido (máximo 100 caracteres)";
        return;
      }

      if (isNaN(Number(this.novaTensao))) {
        this.erroTensaoNominal = "Tensão nominal inválida";
        return;
      }

      this.redesMT.push({
        codigo: this.novoCodigo,
        nome: this.novoNome,
        tensaoNominal: this.novaTensao,
        editar: false,
        novo: true
      });

      this.novoCodigo = '';
      this.novoNome = '';
      this.novaTensao = '';
      this.erroCodigoRedeMT = '';
      this.erroNomeRedeMT = '';
      this.erroTensaoNominal = '';
    },
    cancelar() {
      this.$router.push("/Lista");
    },
  },
});
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

.cancel-btn:hover {
  background-color: #e53935;
}

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

/* Modal base styles */
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

/* Modal de sucesso */
.modal.success {
  border: 2px solid #28a745;
}

.modal.success h2 {
  color: #28a745;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* Modal de erro */
.modal.error {
  border: 2px solid #dc3545;
}

.modal.error h2 {
  color: #dc3545;
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

.action-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


