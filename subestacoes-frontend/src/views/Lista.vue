<template>
  <div>
    <h1>Subestações</h1>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Excluir</th>
          <th>Alterar</th>
          <th>Exibir no Mapa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="subestacao in subestacoes" :key="subestacao.codigo">
          <td>{{ subestacao.codigo }}</td>
          <td>{{ subestacao.nome }}</td>
          <td>
            <button @click="confirmarExclusao(subestacao.id)">🗑️</button>
          </td>
          <td>
            <button @click="confirmarAlteracao(subestacao.codigo)">✏️</button>
          </td>
          <td>
            <button @click="exibirMapa(subestacao)">🌍</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="incluir-btn" @click="incluirSubestacao">Incluir nova Subestação</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Subestacao {
  id: Int16Array;
  codigo: string;
  nome: string;
  latitude: number;
  longitude: number;
}

export default defineComponent({
  name: "Subestacoes",
  setup() {
    const subestacoes = ref<Subestacao[]>([]);
    const mapaVisivel = ref(false);
    const subestacaoSelecionada = ref<Subestacao | null>(null);

    const router = useRouter();

    const googleMapsUrl = computed(() => {
      if (subestacaoSelecionada.value) {
        const { latitude, longitude } = subestacaoSelecionada.value;
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyDihmvnGk0OCH-Lz583sKHIg333rWkEnwI&center=${latitude},${longitude}&zoom=14`;
      }
      return "";
    });

    const fetchSubestacoes = async () => {
      try {
        const response = await axios.get<Subestacao[]>("http://localhost:8080/api/Subestacao");
        subestacoes.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar subestações:", error);
      }
    };

    const incluirSubestacao = () => {
      console.log("Ir para a página de inclusão");
      router.push("/Inclusao");
    };

    const exibirMapa = (subestacao: Subestacao) => {
      router.push({ name: "ExibirMapa", params: { codigo: subestacao.codigo } });
    };

    const confirmarExclusao = (id: Int16Array) => {
      const confirmacao = window.confirm("Deseja realmente excluir esta subestação?");
      if (confirmacao) {
        excluirSubestacao(id);
      }
    };

    const excluirSubestacao = async (id: Int16Array) => {
      try {
        await axios.delete(`http://localhost:8080/api/Subestacao/${id}`);
        alert("Subestação excluída com sucesso!");
        fetchSubestacoes(); // Atualiza a lista de subestações
      } catch (error) {
        console.error("Erro ao excluir subestação:", error);
        alert("Erro ao excluir a subestação.");
      }
    };

    const confirmarAlteracao = (codigo: string) => {
      const confirmacao = window.confirm("Deseja realmente alterar esta subestação?");
      if (confirmacao) {
        alterarSubestacao(codigo);
      }
    };

    const alterarSubestacao = (codigo: string) => {
      router.push({ name: "AlterarSubestacao", params: { codigo } });
    };

    const fecharMapa = () => {
      mapaVisivel.value = false;
      subestacaoSelecionada.value = null;
    };

    onMounted(() => {
      fetchSubestacoes();
    });

    return {
      subestacoes,
      mapaVisivel,
      subestacaoSelecionada,
      googleMapsUrl,
      fetchSubestacoes,
      incluirSubestacao,
      exibirMapa,
      confirmarExclusao,
      excluirSubestacao,
      confirmarAlteracao,
      alterarSubestacao,
      fecharMapa,
    };
  },
});
</script>






<style>
body {
  font-family: Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 1.5rem;
  text-align: center;
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 1rem;
}

thead th {
  border-bottom: 1px solid #ddd;
  text-align: left;
  padding: 8px;
}

tbody td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
}

tbody tr:hover {
  background-color: #f9f9f9;
}


button {
  cursor: pointer;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

button:hover {
  background: #ddd;
}

.incluir-btn {
  display: block;
  margin: 0 auto;
  padding: 8px 16px;
}


.mapa-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.mapa-container h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.mapa-container p {
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.fechar-btn {
  display: block;
  margin: 20px auto 0;
  padding: 8px 16px;
}
</style>
