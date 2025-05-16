import { Component,AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { ModifComponent } from "../modif/modif.component";
import { Modal } from 'bootstrap';
declare var bootstrap: any; // Pour utiliser Bootstrap JS


interface Expense {
  mois: string;
  petit_dejeuner: number;
  dejeuner_diner: number;
}

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
  depot: any;
  depenses: any;
  page = 1; // Page actuelle
  itemsPerPage = 12; // Nombre d'éléments par page
  chart: any;
  etudiant: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadTransactions();
    this.loadMonthDepenses();
    this.loadLastDepotEtDepenses();
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',  // Type de graphique en barres
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [
          {
            label: 'Petit déjeuner',
            data: [],
            backgroundColor: 'blue'
          },
          {
            label: 'Repas / Dîner',
            data: [],
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

    this.loadMonthDepenses();
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
        this.transactions = data.data.transactions.sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des transactions', error);
      }
    );
  }

  loadMonthDepenses(): void {
    this.authService.getMonthDepenses().subscribe(
      (data) => {
        console.log('Dépenses mensuelles:', data);

        const expenses = data.data.expenses;
        console.log('Expenses:', expenses);

        const petitDejData = expenses.map((expense: any) => expense.petit_dejeuner || 0);
        const repasDinerData = expenses.map((expense: any) => expense.dejeuner_diner || 0);
  
        // Mise à jour du graphique
      if (this.chart) {
        this.chart.data.datasets[0].data = petitDejData;
        this.chart.data.datasets[1].data = repasDinerData;
        this.chart.update();
      }
      },
      (error) => {
        console.error('Erreur lors du chargement des dépenses mensuelles', error);
      }
    );
  }
  

  loadLastDepotEtDepenses(): void {
    this.authService.getLastDepotEtDepenses().subscribe(
      (data) => {

         // Vérifier que data contient bien les bonnes valeurs
         if (data) {
          this.depot = {
            dernierDepot: data.data.Dernier_depot,
            depenseSemaine: data.data.Depenses_dans_la_semaine
          };
        }
      },
      (error) => {
        console.error('Erreur lors du chargement du dernier dépôt et des dépenses', error);
      }
    );
  }
  isSettingsOpen: boolean = false;
  modalInstance: any;
  openSettings() {
    this.isSettingsOpen = true;

    
}  openModal(): void {
  let modalElement = document.getElementById('editStudentModal');
  if (modalElement) {
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

closeModal(): void {
  let modalElement = document.getElementById('editStudentModal');
  if (modalElement) {
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

get pavillon(): string {
  return this.utilisateur?.chambre?.charAt(0) ?? 'Neant';
}

get numeroChambre(): string {
  return this.utilisateur?.chambre?.slice(1) ?? 'Neant';
}



}
