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


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dictation', component:  () => import('./HelloWorld.vue')},
  ],
});

export default {
  router,
};
</script>

<style scoped>
nav {
  background-color: blue;
  padding: 20px;
  
}

nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 30px;
  margin-left: 250px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
}

.content {
  padding: 20px;
}
p{
    color: red;
    margin-top: 30px;
}
</style>
