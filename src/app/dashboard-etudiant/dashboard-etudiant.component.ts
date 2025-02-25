import { Component,AfterViewInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Chart from 'chart.js/auto';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-etudiant',
  standalone: true,
  imports: [SidebarEtudiantComponent, SidebarEtudiantComponent,NgxPaginationModule,CommonModule],
  templateUrl: './dashboard-etudiant.component.html',
  styleUrl: './dashboard-etudiant.component.css'
})
export class DashboardEtudiantComponent implements AfterViewInit {
  transactions = [
    { id: 'K287308', type: 'Dépôt', date: '13/09/2022', montant: 3000, status: 'Shipped' },
    { id: 'K287308', type: 'Dépôt', date: '13/09/2025', montant: 3000, status: 'Shipped' },
    { id: 'K283038', type: 'Petit déjeuner', date: '13/09/2022', montant: 50, status: 'Delivered' },
    { id: 'K287265', type: 'Déjeuner', date: '13/09/2022', montant: 100, status: 'Paid' },
    { id: 'K287400', type: 'Dîner', date: '14/09/2022', montant: 200, status: 'Paid' },
    { id: 'K287401', type: 'Boisson', date: '14/09/2022', montant: 150, status: 'Delivered' },
    { id: 'K287402', type: 'Recharge', date: '15/09/2022', montant: 500, status: 'Shipped' },
    { id: 'K287403', type: 'Achat', date: '16/09/2022', montant: 1000, status: 'Paid' }
  ];
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
  utilisateur = {
    nom: 'Nabila Diallo',
    role: 'Étudiant(e)',
    photo: 'assets/profil.png' // Remplace par le chemin de la photo de l'utilisateur
  };


  page = 1; // Page actuelle
  itemsPerPage = 4; // Nombre d'éléments par page

}
