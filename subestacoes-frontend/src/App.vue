<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';

const router = useRouter();


const Deslogar = () => {
  router.push('/'); 
};

// const IsLoginPage = () => route.path === '/'; 
</script>
<template>
  <header v-if="!IsLoginPage">
    <div class="wrapper">
      <HelloWorld msg="SistemaSRE" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/Lista">Subestações</RouterLink>
        <RouterLink to="/Inclusao">Incluir</RouterLink>
        <!-- <RouterLink to="/AlterarSubestacao">Alterar</RouterLink> -->
        <!-- <RouterLink to="/ExibirMapa">Visualização</RouterLink> -->
        <button @click="Deslogar">Sair</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>



<style scoped>
header {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  line-height: 1.5;
  max-height: 100vh;
  background-color: #fff; 
  display: flex; 
  justify-content: center;

  padding: 1rem 0;
}

.wrapper {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  width: 100%;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    
    justify-content: space-between; 
    padding: 1rem 2rem;
  }

  .wrapper {
    flex-direction: row; 
    align-items: center;
  }

  nav {
    text-align: center;
    margin-left: 0;
    font-size: 1rem;
    padding: 0;
    margin-top: 0;
  }
}
</style>