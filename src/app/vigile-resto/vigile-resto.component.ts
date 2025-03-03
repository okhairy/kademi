import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MeteoService } from '../services/meteo.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vigile-resto',
  imports: [CommonModule],
  templateUrl: './vigile-resto.component.html',
  styleUrl: './vigile-resto.component.css'
})
export class VigileRestoComponent implements OnInit{

  weatherData: any;

  constructor(private router: Router, private meteoService: MeteoService) {}

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData(): void {
    this.meteoService.getWeather().then(data => {
      this.weatherData = data;
      console.log(this.weatherData); // Pour vérifier les données reçues
    }).catch(error => {
      console.error('Erreur lors de la récupération des données météo', error);
    });
  }

  logout() {
    // Ajoutez ici la logique de déconnexion si nécessaire
    this.router.navigate(['/login']);
  }
}
