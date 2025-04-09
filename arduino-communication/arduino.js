const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
const WebSocket = require('ws');

// Démarrer le serveur WebSocket sur le port 8081
const wss = new WebSocket.Server({ port: 8081 });

console.log("🟢 Serveur WebSocket démarré sur ws://localhost:8081");

let selectedStudentId = null; // Variable pour stocker l'ID de l'étudiant

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
    console.log("🔗 Un client Angular s'est connecté.");

    // Écouter les messages du client Angular
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.action === 'setStudentId') {
            selectedStudentId = data.studentId; // Stocker l'ID de l'étudiant
            console.log("🆔 ID de l'étudiant sélectionné :", selectedStudentId);
        }
    });
});

// Ouvrir la connexion avec l'Arduino
const port = new SerialPort({
  path: '/dev/ttyACM0', // Remplace par ton port (ex: "COM3" sous Windows)
  baudRate: 9600
});

// Utilisation d'un parser pour lire les données ligne par ligne
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Quand une carte RFID est scannée
parser.on('data', async (uid) => {
    const uidCarte = uid.trim(); // Nettoyage de l'UID

    console.log("📌 Carte détectée, UID :", uidCarte);

    // Envoyer l'UID en temps réel à Angular via WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(uidCarte);
        }
    });

    if (!selectedStudentId) {
        console.error("❌ Aucun ID d'étudiant sélectionné.");
        return;
    }

    try {
        const url = `http://127.0.0.1:8000/api/assigner-carte/${selectedStudentId}`;

        // Logs de débogage
        console.log("URL :", url);
        console.log("Headers :", { 'Content-Type': 'application/json' });
        console.log("Body :", { uid_carte: uidCarte });

        // Envoyer la requête à Laravel
        const response = await axios.post(url, { uid_carte: uidCarte }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("✅ Réponse Laravel :", response.data);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi des données à Laravel :", error.message);
        if (error.response) {
            console.error("Détails de l'erreur :", error.response.data);
        }
    }
});