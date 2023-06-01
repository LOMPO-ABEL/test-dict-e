<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/dictation">Dictée</router-link></li>
        <li><router-link to="/help">Aide</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
    <p>BONJOUR</p>
  </div>
</template>

<script>
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dictation', component: () => import('./HelloWorld.vue') },
  ],
});

export default {
  router,
};
</script>

<style>
  /* Importation du fichier CSS externe */
  @import './mytemplate.css';
</style>
