
<template>

      <div class="test-dictation">
            <h1><span>Dictée en ligne</span></h1>
            <div class="container">
              <label for="difficulty">Niveau de difficulté :</label>
              <select id="difficulty" v-model="selectedDifficulty" @change="setDifficultyLevel(selectedDifficultyLevel)">
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
                  <input id="repetitionsEnabled" type="checkbox" v-model="repetitionsEnabled">
                  Répéter les phrases
                </label>

                <div>
                  <p>Temps restant : {{ timeRemaining }}s</p>
                </div>

                <h2>{{ selectedSubject.title }}</h2>
                <button @click="startDictation">{{ "Reprendre" }}</button>

                <div v-for="phrase in selectedSubject.phrases" :key="phrase.text">
                  <p>{{ phrase.text }}</p>
                  <input type="number" v-model="phrase.repetitions" min="1">
                </div>

                <button @click="startGeneralRepeat">{{ "Répétition générale" }}</button>
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

            <div v-if="showCorrection">
              <h2>Correction de la dictée</h2>
              <p>Sujet : {{ correctionSubject.title }}</p>
              <p>Votre Réponse: <span v-html="formatUserAnswer()"></span></p>
              <p>Vous avez eu la Note de: {{ score }}/20</p>
              <p>Et voici la Correction :</p>
              <div v-for="phrase in correctionSubject.phrases" :key="phrase.text">
                <p :class="{ 'incorrect': phrase.userInput !== userInput }">{{ phrase.text }}</p>
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
                timeLimit: 15, // Temps limite en secondes
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
                selectedVoice: null,
                showCorrection: false,
                correctionSubject: null,
                repetitionCount: 1, // Nombre de répétitions par défaut (niveau Difficile)

                pitchValues: {
                  facile: 0.8,  // Valeur de hauteur (pitch) pour le niveau Facile
                  moyen: 1,    // Valeur de hauteur (pitch) pour le niveau Moyen
                  difficile: 1.2  // Valeur de hauteur (pitch) pour le niveau Difficile
                },
                rateValues: {
                  facile: 0.8,  // Valeur de vitesse (rate) pour le niveau Facile
                  moyen: 1,    // Valeur de vitesse (rate) pour le niveau Moyen
                  difficile: 1.2  // Valeur de vitesse (rate) pour le niveau Difficile
                },
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

              watch: {
                selectedDifficulty() {
                  this.difficultyChanged();
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

              formatUserAnswer() {
                const userAnswer = this.userInput.trim();
                if (userAnswer === '') {
                  return userAnswer;
                }

                const correctedAnswer = this.correctionSubject.phrases.map(phrase => {
                  const phraseWords = phrase.userInput.split(' ');
                  const userWords = userAnswer.split(' ');

                  const correctedWords = phraseWords.map((word, index) => {
                    if (index >= userWords.length || word !== userWords[index]) {
                      return `<span class="error-word">${word}</span>`;
                    } else {
                      return word;
                    }
                  });

                  return correctedWords.join(' ');
                });

                return correctedAnswer.join(' ');
              },

              async startDictation() {
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
                  await this.getSelectedVoice();
                // this.currentText = this.selectedSubject.text; // Modifier ici pour utiliser la variable correcte
                  this.speakText(this.selectedSubject.text, this.repetitionCount, this.selectedSubject.repetitions, this.repetitionsEnabled); // Modifier ici pour utiliser la variable correcte
              },

              setDifficultyLevel(level) {
                if (level === 'facile') {
                  this.repetitionCount = 3;
                } else if (level === 'moyen') {
                  this.repetitionCount = 2;
                } else if (level === 'difficile') {
                  this.repetitionCount = 1;
                }
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
                    utterance.pitch = isFinite(this.pitchValues[this.selectedDifficulty]) ? this.pitchValues[this.selectedDifficulty] : 1;
                    utterance.rate = isFinite(this.rateValues[this.selectedDifficulty]) ? this.rateValues[this.selectedDifficulty] : 1;

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

              getSelectedVoice() {
                  return new Promise((resolve) => {
                    const synth = window.speechSynthesis;
                    if (synth.onvoiceschanged !== undefined) {
                      synth.onvoiceschanged = () => {
                        const voices = synth.getVoices();
                        const selectedLanguage = this.selectedLanguage;

                        // Vérifier si la voix correspondant à la langue sélectionnée est disponible
                        const selectedVoice = voices.find((voice) => voice.lang === selectedLanguage);

                        if (selectedVoice) {
                          this.selectedVoice = selectedVoice;
                        } else {
                          // La voix pour la langue sélectionnée n'est pas disponible
                          console.error(`La voix pour la langue '${selectedLanguage}' n'est pas disponible.`);
                        }

                        resolve();
                      };
                    } else {
                      resolve();
                    }
                  });
                },


                difficultyChanged() {
                    if (this.isDictationStarted) {
                      // Mettre à jour la hauteur (pitch) et la vitesse (rate) de la voix en fonction de la difficulté sélectionnée
                      if (this.synth && this.selectedVoice) {
                        this.selectedVoice.pitch = this.pitchValues[this.selectedDifficulty];
                        this.selectedVoice.rate = this.rateValues[this.selectedDifficulty];
                      }

                      // Relancer la dictée avec la nouvelle hauteur (pitch) et la nouvelle vitesse (rate)
                      this.speakText(this.selectedSubject.text, this.selectedSubject.repetitions);
                    }
                  },

                  speakGeneralRepeat() {
                    if (this.selectedSubject && this.selectedSubject.phrases) {
                      const fullText = this.selectedSubject.phrases.map(phrase => phrase.text).join('. ');
                      const repetitions = this.selectedSubject.phrases.reduce((total, phrase) => total + phrase.repetitions, 0);

                      this.speakText(fullText, repetitions);
                    }
                  },

               checkAnswer() {

                  if (this.isCorrectionChecked) {
                    clearInterval(this.timer);
                    return;
                  }

                  const userAnswer = this.userInput.trim();
                  const expectedAnswer = this.selectedSubject.text.trim();

                  const userWords = userAnswer.split(' ');
                  const expectedWords = expectedAnswer.split(' ');
                  let score = 0;

                  for (let i = 0; i < userWords.length; i++) {
                      if (i < expectedWords.length && userWords[i] === expectedWords[i]) {
                          score++;
                        }
                  }

                  const maxScore = expectedWords.length;
                  const percentage = (score / maxScore) * 20; // Calcul du pourcentage correspondant à la note sur 20
                  this.score = percentage.toFixed(2); // Stockage de la note dans la propriété 'score'

                  let correctedAnswer = '';
                  if (this.isTimeUp) {
                      correctedAnswer = userAnswer; // Utiliser la réponse de l'utilisateur telle quelle
                  } else {
                  correctedAnswer = userWords.map((word, index) => {
                  if (word === expectedWords[index]) {
                      return word;
                  } else {
                      return `<span class="error-word">${word.replace(/<|>/g, '')}</span>`;
                  }
                  }).join(' ');
                  }

                   this.isCorrectionChecked = true;
                   this.userInput = correctedAnswer;

                   clearInterval(this.timer);
                  if (this.currentRepetition < this.maxRepetitions) {
                    this.currentRepetition++;
                    this.isDictationStarted = true;
                  } else {
                        // ...
                         this.isDictationStarted = false;
                         this.currentText = ""
                  }
                  // Réinitialiser les valeurs
                  this.isDictationStarted = false;
                  this.currentText = "";
                  this.userInput = "";
                  // Afficher la correction
                  this.showCorrection = true;
                  this.correctionSubject = {
                      title: this.selectedSubject.title,
                      phrases: this.selectedSubject.text.split('. ').map(text => ({ text, userInput: correctedAnswer })),
                  };
                    this.userInput = correctedAnswer;
                },
        }
};
  
</script>

<style>
  /* Importer votre fichier CSS externe */
  @import './CSS/hello-world.css';
</style>
