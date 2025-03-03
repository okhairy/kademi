import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MeteoService } from '../services/meteo.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtudiantService } from '../services/etudiant.service';

@Component({
  selector: 'app-dashboard-vigile',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './dashboard-vigile.component.html',
  styleUrl: './dashboard-vigile.component.css'
})
export class DashboardVigileComponent implements OnInit{
  weatherData: any;
  etudiantData: any;
  accessMessage: string = '';

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
      this.checkAccess(scannedCard);
    }
  }}

  checkAccess(uidCarte: string): void {
    this.etudiantService.checkAccesCampus(uidCarte).subscribe(
      (data) => {
        this.etudiantData = data.etudiant;
        this.accessMessage = data.message; // Assurez-vous que l'API renvoie un champ 'message'
        console.log('Accès vérifié:', data);
      },
      (error) => {
        console.error('Erreur lors de la vérification de l\'accès', error);
        this.accessMessage = 'Erreur lors de la vérification de l\'accès.';
      }
    );
  }

  logout() {
    // Ajoutez ici la logique de déconnexion si nécessaire
    this.router.navigate(['/login']);
  }
}
