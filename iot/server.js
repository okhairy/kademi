const WebSocket = require('ws');
const { SerialPort } = require('serialport'); // Pour gérer la communication série
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: 'COM3', baudRate: 9600 }, (err) => {
    if (err) {
        return console.error('Error opening serial port:', err.message);
    }
    console.log('Serial Port Opened');
});


port.on('open', () => {
    console.log('Serial Port Opened');
});

port.on('error', (err) => {
    console.error('Error: ', err.message);
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log('Received from Arduino:', data);
    // Broadcast the received data to all connected WebSocket clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`${data}`);
        }
    });
});
const wss = new WebSocket.Server({ port: 3004 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  connectedClient = ws; // Sauvegarde du client WebSocket connecté

  ws.on('message', (message) => {
    console.log('Réponse reçue du client WebSocket:', message);

    // Envoi de la réponse à l'Arduino
    port.write(message + '\n', (err) => {
        if (err) {
            return console.error('Erreur d\'envoi à l\'Arduino:', err.message);
        }
        console.log(`Message envoyé à l'Arduino: ${message}`);
    });
});

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

});

console.log('WebSocket server is running on ws://localhost:3004');