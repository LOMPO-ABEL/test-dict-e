import { subjects } from "@/data";
import subjects from './subjects.json';


<template>
  <div class="test-dictation">

    <h1><span>Dicté en ligne</span></h1>
    <div class="container">
      <label for="difficulty">Niveau de difficulté :</label>
      <select id="difficulty" v-model="selectedDifficulty">
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>
    </div>

    <div class="container">
      <label for="language">Langue :</label>
      <select id="language" v-model="selectedLanguage">
        <option value="en-US">English</option>
        <option value="fr-FR">Français</option>
        <!-- Ajoutez d'autres options pour les autres langues si nécessaire -->
      </select>
    </div>

    <div v-if="filteredSubjects.length > 0" class="container">
      <label for="subject">Sujet :</label>
      <select id="subject" v-model="selectedSubject">
        <option value="" disabled selected>Sélectionnez un sujet</option>
        <option v-for="subject in filteredSubjects" :key="subject.title" :value="subject">{{ subject.title }}</option>
      </select>
      </div>
      <div class="subject-actions">
        <button @click="createSubject">Nouveau sujet</button>
        <button @click="updateSubject">Mettre à jour</button>
        <button @click="deleteSubject">Supprimer</button>
        
      </div>
    
       <div v-if="isCreatingNewSubject">
        <h2>Nouveau sujet</h2>
        <label for="new-subject-title">Titre :</label>
        <input type="text" id="new-subject-title" v-model="newSubject.title">

        <label for="new-subject-text">Texte :</label>
        <textarea id="new-subject-text" v-model="newSubject.text"></textarea>

        <button @click="saveNewSubject">Enregistrer</button>
        <button @click="cancelNewSubject">Annuler</button>
       </div>

    <div v-if="selectedSubject">
      <h2>{{ selectedSubject.title }}</h2>
      <button @click="startDictation">Commencer la dictée</button>

      <div v-if="isDictationStarted">
        <p>{{ currentText }}</p>
        <textarea v-model="userInput"></textarea>
        <button @click="checkAnswer">Vérifier</button>
        <button @click="speakText(selectedSubject.text)">Lire le texte</button>

        <label for="repetitionsEnabled">
          <input
            id="repetitionsEnabled"
            type="checkbox"
            v-model="repetitionsEnabled"
          >
          Répéter les phrases
        </label>

        <div>
          <p>Temps restant : {{ timeRemaining }}s</p>
        </div>
        
        <h2>{{ selectedSubject.title }}</h2>
        <button @click="startDictation">{{ ("Reprendre") }}</button>
        <div v-for="phrase in selectedSubject.phrases" :key="phrase.text">
           <p>{{ phrase.text }}</p>
           <input type="number" v-model="phrase.repetitions" min="1">
        </div>
        <button @click="startGeneralRepeat">{{ ("RépétitionGénéral") }}</button>
        <button @click="repeatDictation">Répéter</button>

        <div>
          <p>Répétitions restantes : {{ maxRepetitions - currentRepetition }}</p>
        </div>
        
      </div>

      <div class="container">
        <label for="volume">Volume :</label>
        <input type="range" id="volume" v-model="volume" min="0" max="1" step="0.1">
      </div>

    </div>
  </div>
</template>

<script>
import subjects from './subjects.json';

export default {

  data() {

    return {
      selectedLanguage: 'fr-FR', // Remplacez 'fr-FR' par la langue de votre choix
      maxRepetitions: 3, // Nombre maximal de répétitions autorisées
      currentRepetition: 1,
      timer: null,
      timeLimit: 60, // Temps limite en secondes
      timeRemaining: 0,
      repetitionsEnabled: false,
      isCreatingNewSubject: false,
      newSubject: {
      title: "",
      text: "",
       synth: null,
    },
    volume: 1,
    subjects: subjects,

      
        selectedDifficulty: "",
        selectedSubject: null,
        isDictationStarted: false,
        currentText: "",
        userInput: ""
    };
  },

    computed: {
        filteredSubjects() {
          if (this.selectedDifficulty) {
          return this.subjects.filter(subject => subject.difficulty === this.selectedDifficulty);
          } 
          else {
            return this.subjects;
          }
        }
      },

    methods: {
        createSubject() {
          const newSubject = {
            title: "Nouveau sujet",
            difficulty: "",
            text: "", 
          };
          this.isCreatingNewSubject = true;
          this.newSubject = {
            title: "",
            text: ""
          };
          this.subjects.push(newSubject);
          this.selectedSubject = newSubject;
        },

        updateSubject() {
             // Implémentez la logique pour mettre à jour le sujet sélectionné
        },
        deleteSubject() {
             // Implémentez la logique pour supprimer le sujet sélectionné
        },

        cancelNewSubject() {
          this.isCreatingNewSubject = false;
          this.newSubject = null;
        },

         saveNewSubject() {
          // Génère un ID et un numéro pour le nouveau sujet
          const newId = this.subjects.length > 0 ? this.subjects[this.subjects.length - 1].id + 1 : 1;
          const newNumber = this.subjects.length + 1;

          // Crée le nouvel objet sujet
          const newSubject = {
            id: newId,
            number: newNumber,
            title: this.newSubject.title,
            difficulty: "", // Définir la difficulté selon les besoins
            text: this.newSubject.text
          };

          // Ajoute le sujet au tableau
          this.subjects.push(newSubject);

          // Réinitialise les valeurs pour le prochain nouveau sujet
          this.newSubject.title = "";
          this.newSubject.text = "";
          
          // Sélectionne le nouveau sujet créé
          this.selectedSubject = newSubject;

          // Désactive le mode de création de nouveau sujet
          this.isCreatingNewSubject = false;
        },

        repeatDictation() {
          this.speakGeneralRepeat();
        },

      startDictation() {
          this.currentRepetition = 1;
          this.timeRemaining = this.timeLimit;
          this.timer = setInterval(() => {
            if (this.timeRemaining > 0) {
              this.timeRemaining--;
            } else {
              clearInterval(this.timer);
              this.checkAnswer();
            }
          }, 1000);
          this.isDictationStarted = true;
         // this.currentText = this.selectedSubject.text; // Modifier ici pour utiliser la variable correcte
          this.speakText(this.selectedSubject.text, this.selectedSubject.repetitions, this.repetitionsEnabled); // Modifier ici pour utiliser la variable correcte
      },

     speakText(fullText, repetitions) {
      if (this.synth === undefined) {
        this.synth = window.speechSynthesis;
      }

      const phrases = fullText.split('. ');
      const speechQueue = [];

      phrases.forEach((text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;

       if (isFinite(this.volume)) {
          utterance.volume = parseFloat(this.volume);
        } else {
          utterance.volume = 1;
        }
        utterance.pitch = isFinite(this.pitch) ? this.pitch : 1;
        utterance.rate = isFinite(this.rate) ? this.rate : 1;

        utterance.onend = () => {
          if (repetitions > 0) {
            speechQueue.push(utterance);
            speechQueue.push(new SpeechSynthesisUtterance(text));
            repetitions--;
          }

          if (speechQueue.length > 0) {
            const nextUtterance = speechQueue.shift();
            this.synth.speak(nextUtterance);
          }
        };

        speechQueue.push(utterance);
      });

      const firstUtterance = speechQueue.shift();
      this.synth.speak(firstUtterance);
    },



      speakGeneralRepeat() {
        if (this.selectedSubject && this.selectedSubject.phrases) {
          const fullText = this.selectedSubject.phrases.map(phrase => phrase.text).join('. ');
          const repetitions = this.selectedSubject.phrases.reduce((total, phrase) => total + phrase.repetitions, 0);

          this.speakText(fullText, repetitions);
        }
      },


      checkAnswer() {
          const userAnswer = this.userInput.trim();
          const expectedAnswer = this.selectedSubject.text.trim();
            if (userAnswer === expectedAnswer) {
              alert("Bonne réponse !");
            } else {
              alert("Mauvaise réponse. Réessayez !");
            }

            if (this.currentRepetition < this.maxRepetitions) {
              this.currentRepetition++;
              this.isDictationStarted = true;
            } else {
              // ...
            }
            // Réinitialiser les valeurs
            this.isDictationStarted = false;
            this.currentText = "";
            this.userInput = "";
          }
        }
  };
</script>

<style>
  /* Importer votre fichier CSS externe */
  @import './hello-world.css';
</style>
