import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import AccueilPage from './components/AccueilPage.vue';
import HelloWorld from './components/HelloWorld.vue';



const routes = [
  { path: '/', component: AccueilPage }, // Composant vide pour l'accueil
  { path: '/dictation', component: HelloWorld }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
