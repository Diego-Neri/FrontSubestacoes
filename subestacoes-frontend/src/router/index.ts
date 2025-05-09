import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Lista from '../views/Lista.vue';
import Inclusao from '../views/Inclusao.vue';
import ExibirMapa from '../views/ExibirMapa.vue';
import AlterarSubestacao from '../views/AlterarSubestacao.vue';

const routes = [
  { 
    path: '/', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/lista', 
    name: 'Lista', 
    component: Lista 
  },
  { 
    path: '/inclusao', 
    name: 'Inclusao', 
    component: Inclusao 
  },
  { 
    path: '/exibir-mapa/:codigo', 
    name: 'ExibirMapa', 
    component: ExibirMapa, 
    props: true // Permite que o parâmetro "codigo" seja passado como prop para o componente
  },
  { 
    path: '/alterar-subestacao/:codigo', 
    name: 'AlterarSubestacao', 
    component: AlterarSubestacao, 
    props: true // Permite que o parâmetro "codigo" seja passado como prop para o componente
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
