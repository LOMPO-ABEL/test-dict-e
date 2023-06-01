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
  </div>
  
</template>

<script>
import { createRouter, createWebHistory } from 'vue-router';

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./AccueilPage.vue') },
    { path: '/dictation', component: () => import('./HelloWorld.vue') },
  ],
});

export default {
  routes,
};
</script>

<style>
  /* Importation du fichier CSS externe */
 @import './CSS/mytemplate.css';
</style>
