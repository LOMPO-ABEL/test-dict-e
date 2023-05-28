const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/subjects', (req, res) => {
    const subjects = req.body;
    const jsonSubjects = JSON.stringify(subjects, null, 2);
  
    fs.writeFile('subjects.json', jsonSubjects, 'utf8', (err) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement des sujets :', err);
        res.sendStatus(500);
      } else {
        console.log('Sujets enregistrés avec succès.');
        res.sendStatus(200);
      }
    });
  });
  app.get('/api/subjects', (req, res) => {
    fs.readFile('subjects.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur lors de la récupération des sujets :', err);
        res.sendStatus(500);
      } else {
        const subjects = JSON.parse(data);
        res.json(subjects);
      }
    });
  });
  const port = 3000;
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
      