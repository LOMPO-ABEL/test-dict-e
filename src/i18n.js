import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import VueI18n from 'vue-i18n';
import App from './App.vue';

const app = createApp(App);
app.use(VueI18n);

const messages = {
  en: {
    welcome: "Welcome to the Dictation Test App",
    difficulty: "Difficulty",
    subject: "Subject",
    newSubject: "New Subject",
    update: "Update",
    delete: "Delete",
    remainingTime: "Time remaining: {time}s",
    remainingRepetitions: "Repetitions remaining: {repetitions}"
  },
  fr: {
    welcome: "Bienvenue dans l'application de test de dictée",
    difficulty: "Difficulté",
    subject: "Sujet",
    newSubject: "Nouveau sujet",
    update: "Mettre à jour",
    delete: "Supprimer",
    remainingTime: "Temps restant : {time}s",
    remainingRepetitions: "Répétitions restantes : {repetitions}"
  },

  es: {
    // Messages en espagnol
    welcome: "Bienvenido a la aplicación de prueba de dictado",
    difficulty: "Dificultad",
    subject: "Tema",
    newSubject: "Nuevo tema",
    update: "Actualizar",
    delete: "Eliminar",
    remainingTime: "Tiempo restante: {time}s",
    remainingRepetitions: "Repeticiones restantes: {repetitions}"
  },
  de: {
    // Messages en allemand
    welcome: "Willkommen bei der Diktat-Test-App",
    difficulty: "Schwierigkeit",
    subject: "Thema",
    newSubject: "Neues Thema",
    update: "Aktualisieren",
    delete: "Löschen",
    remainingTime: "Verbleibende Zeit: {time}s",
    remainingRepetitions: "Verbleibende Wiederholungen: {repetitions}"
  }
};

const i18n = createI18n({
  locale: "en",
  messages,
  globalInjection: true,
});

app.use(i18n);
app.mount('#app');

export default i18n;
