import { Component,AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-etudiant',
    standalone: true,
    imports: [CommonModule, SidebarEtudiantComponent, NgxPaginationModule],
    templateUrl: './dashboard-etudiant.component.html',
    styleUrl: './dashboard-etudiant.component.css'
})

export class DashboardEtudiantComponent implements OnInit, AfterViewInit {
  transactions: any[] = [];
  utilisateur: any;
  page = 1; // Page actuelle
  itemsPerPage = 4; // Nombre d'éléments par page

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadTransactions();
    this.loadWeekDepenses();
    this.loadLastDepotEtDepenses();
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',  // Type de graphique en barres
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'Petit déjeuner',
            data: [1200, 1500, 800, 2000, 1800, 1600, 1700, 1400, 2200, 2500, 2700, 3000],
            backgroundColor: 'blue'
          },
          {
            label: 'Repas / Dîner',
            data: [1000, 1200, 900, 1700, 1500, 1400, 1600, 1300, 2000, 2300, 2500, 2800],
            backgroundColor: 'black'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { 
            grid: { display: false } // Cache la grille horizontale
          },
          y: { 
            beginAtZero: true 
          }
        }
      }
    });
  }
  loadUserData(): void {
    this.authService.getUserConnected().subscribe(
      (data) => {
        this.utilisateur = data.data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données de l\'utilisateur', error);
      }
    );
  }

  loadTransactions(): void {
    this.authService.getTransactions().subscribe(
      (data) => {
        console.log("transactions", data);
        this.transactions = data.data;
      },
      (error) => {
        console.error('Erreur lors du chargement des transactions', error);
      }
    );
  }

  loadWeekDepenses(): void {
    this.authService.getWeekDepenses().subscribe(
      (data) => {
        // Mettez à jour les données de dépenses hebdomadaires ici
        console.log('Dépenses hebdomadaires:', data);
      },
      (error) => {
        console.error('Erreur lors du chargement des dépenses hebdomadaires', error);
      }
    );
  }

  loadLastDepotEtDepenses(): void {
    this.authService.getLastDepotEtDepenses().subscribe(
      (data) => {
        // Mettez à jour les données du dernier dépôt et des dépenses ici
        console.log('Dernier dépôt et dépenses:', data);
      },
      (error) => {
        console.error('Erreur lors du chargement du dernier dépôt et des dépenses', error);
      }
    );
  }

}
