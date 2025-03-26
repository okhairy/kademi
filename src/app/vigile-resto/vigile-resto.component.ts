import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MeteoService } from '../services/meteo.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtudiantService } from '../services/etudiant.service';

@Component({
  selector: 'app-vigile-resto',
  imports: [CommonModule],
  templateUrl: './vigile-resto.component.html',
  styleUrl: './vigile-resto.component.css'
})
export class VigileRestoComponent implements OnInit{
  etudiantData: any;
  accessMessage: string = '';
  weatherData: any;
  transactions: any;

  constructor(private router: Router, private meteoService: MeteoService, private etudiantService: EtudiantService) {}

  ngOnInit(): void {
    this.getWeatherData();
    this.listenToWebSocket();
  }

  getWeatherData(): void {
    this.meteoService.getWeather().then(data => {
      this.weatherData = data;
      console.log(this.weatherData); // Pour vérifier les données reçues
    }).catch(error => {
      console.error('Erreur lors de la récupération des données météo', error);
    });
  }

  listenToWebSocket(): void {
    const ws = new WebSocket('ws://localhost:3004');
    ws.onmessage = (event) => {

      if (event.data !== '') 
      {
        const scannedCard = event.data;
      console.log('Carte scannée:', scannedCard);
      this.checkAccess(scannedCard, ws);
    }
  }}

  checkAccess(uidCarte: string, ws: WebSocket): void {
    this.etudiantService.checkAccesResto(uidCarte).subscribe(
      (data) => {
        this.etudiantData = data.etudiant;
        this.accessMessage = data.message; // Assurez-vous que l'API renvoie un champ 'message'
        this.transactions = data.transaction;
        console.log('Accès vérifié:', data);
        console.log('message de lapi:', data.message);

        // Envoyer "OK" ou "NO" au serveur WebSocket
        const responseMessage = this.accessMessage === 'Retrait effectué avec succès' ? "OK" : "NO";
        ws.send(responseMessage);
        console.log('Message envoyé au serveur WebSocket:', responseMessage);
      },
      (error) => {
        console.error('Erreur lors de la vérification de l\'accès', error);
        this.accessMessage = 'Erreur lors de la vérification de l\'accès.';
        const responseMessage = "NO";
        ws.send(responseMessage);
      }
    );
  }

  closeModal(): void {
    this.etudiantData = null; // Réinitialise les données de l'étudiant
    this.accessMessage = ''; // Réinitialise le message d'accès
  }

  logout() {
    // Ajoutez ici la logique de déconnexion si nécessaire
    this.router.navigate(['/login']);
  }
}
