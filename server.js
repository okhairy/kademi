const SerialPort = require('serialport');
const axios = require('axios');

// Définir le port série auquel l'Arduino est connecté (assure-toi que le port correspond)
const port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600,  // Vitesse de communication (doit correspondre à celle de l'Arduino)
});

// Lire les données envoyées par Arduino
port.on('data', (data) => {
  console.log('Données reçues :', data.toString());

  // Supposons que l'Arduino envoie un ID de carte RFID ou d'autres informations
  const rfidData = data.toString().trim();  // Manipuler les données reçues pour les envoyer à Laravel

  // Envoie des données à Laravel via une requête POST
  axios.post('http://localhost:8000/api/arduino-data', {
    rfid: rfidData,  // Envoie le RFID ou toute autre donnée nécessaire
  })
  .then((response) => {
    console.log('Réponse de Laravel:', response.data);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'envoi à Laravel:', error);
  });
});

// Gérer les erreurs de port série
port.on('error', (err) => {
  console.error('Erreur du port série:', err.message);
});
