<template>
  <div>
    <h1 style="color: yellow">BONJOUR ET BIENVENUE DANS <span style="color: blue">APPRENDRE LA CONJUGAISON</span></h1>
    <form style="margin-top: 100px">
      <input type="text" v-model="verbe" placeholder="Entré le Verbe à conjuguer" />
      <select v-model="temps" @change="conjuguer">
        <option value="" disabled selected>Choisisez un temps à conjuguer</option>
        <option v-for="tempsSimple in tempsSimples" :value="tempsSimple" :key="tempsSimple">{{ tempsSimple }}</option>
      </select>
    </form>

    <div>
      <h2 v-if="result">{{ verbe }} au {{ temps }}</h2>
      <p v-if="result" style="white-space: pre-line" class="centered-text">{{ result }}</p>
      <button v-if="result" @click="lireResultat" class="centered-button">Lire la conjugaison</button>
    </div>
  </div>
</template>

<script>
import { getConjugation} from 'french-verbs';
import Lefff from 'french-verbs-lefff/dist/conjugations.json';

export default {
      data() {
        return {
          verbe: '',
          temps: '',
          result: '',
          tempsSimples: [
            'PRESENT',
            'FUTUR',
            'IMPARFAIT',
            'PASSE_SIMPLE',
            'CONDITIONNEL_PRESENT',
            'IMPERATIF_PRESENT',
            'SUBJONCTIF_PRESENT',
            'SUBJONCTIF_IMPARFAIT',
            'PASSE_COMPOSE',
            'PLUS_QUE_PARFAIT',

            
          ],
        };
      },
        methods: {
         conjuguer() {
            const verbesImpersonnels = ['pleuvoir', 'neiger', 'sembler']; // Ajoutez d'autres verbes impersonnels si nécessaire

            if (this.verbe && this.temps) {
             if (verbesImpersonnels.includes(this.verbe)) {
                this.result = `Le verbe '${this.verbe}' est impersonnel et n'est pas conjugué selon les personnes au ${this.temps}.`;
                this.titre = `Verbe '${this.verbe}' au ${this.temps}`;
                return;
              }
              const verbConjugations = Lefff[this.verbe];
              if (!verbConjugations) {
                this.result = "Veuillez entrer un verbe valide.";
                return;
              }
              const pronoms = ['Je', 'Tu', 'Il/Elle', 'Nous', 'Vous', 'Ils/Elles'];
              const conjugations = pronoms.map((pronom, i) => {
                const conjugation = getConjugation(Lefff, this.verbe, this.temps, i);
                return `${pronom} ${conjugation}`;
              });
              this.result = conjugations.join('\n\n');
              this.titre = `${this.verbe} au ${this.temps}`;
            } else {
                 console.log('Veuillez entrer un verbe et un temps.');
            }
          },

        lireResultat() {
            const lines = this.result.split('\n');
            const delay = 1000; // Durée de la pause entre chaque ligne (en millisecondes)

            lines.forEach((line, index) => {
              setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(line);
                speechSynthesis.speak(utterance);
              }, index * delay);
            });
          },

        },
};
</script>

<style>
/* Ajoutez le code CSS ici */
    @import './CSS/conjugaison.css';
</style>
