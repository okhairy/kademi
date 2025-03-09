import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EtudiantService } from '../services/etudiant.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard-admin',
    imports: [SidebarComponent],
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements AfterViewInit,OnInit {
  nombreEtudiants: number = 0; // Stockera le nombre d'étudiants
  totaux: any;
  chart: any;
  chart2: any;

  constructor(private etudiantService: EtudiantService, private authservice: AuthService) {}

  ngOnInit(): void {
    this.getNombreEtudiants();
    this.getUsers();
  }

  getNombreEtudiants(): void {
    this.etudiantService.getNombreEtudiants().subscribe(
      (data) => {
        this.nombreEtudiants = data.nombre_etudiants; // Stocke le nombre récupéré
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre d\'étudiants', error);
      }
    );
  }

  getUsers() {
    this.authservice.getusers().subscribe(
      (data) => {
        console.log("Données nbr reçues :", data.data);

        // Vérifier si les données existent
        if (!data?.data) {
          console.error("Données invalides reçues :", data.data);
          return;
        }

        this.totaux = {
          nombre_total_utilisateurs: data.data.nombre_total_utilisateurs,
          vigiles : data.data.nombre_vigiles,
          admins: data.data.nombre_admins,
        };

      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      });
    }
  
  
  ngAfterViewInit() {
    this.loadBarChart();
    this.loadDonutChart();
  }

  getMeals() {
      this.authservice.getMeals().subscribe(
        (data) => {
          console.log("Données reçues :", data);

        // Vérifier si les données existent
        if (!data?.data?.meals) {
          console.error("Données invalides reçues :", data);
          return;
        }

        const meals = data.data.meals;

        // Extraire uniquement les dépenses sous forme de tableau
        const depensesData = meals.map((meal: any) => meal.depenses || 0);

        if (this.chart) {
          // Mettre à jour les données du graphique
          this.chart.data.datasets[0].data = depensesData;
          this.chart.update();
        }

        },
        (error) => {
          console.error('Erreur lors de la récupération des repas', error);
        }
      );
    }
    
  // Histogramme des achats de tickets par mois
  loadBarChart() {
    this.chart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Achats de tickets",
          data: [],
          backgroundColor: "#5a3ffb",
          hoverBackgroundColor: "#3a27d3",
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    this.getMeals();
  }

  getDailyMeals() {
    this.authservice.getdailyMeals().subscribe(
      (data) => {
        console.log("Données reçues :", data);
  
        // Vérifier si les données existent
        if (!data?.data) {
          console.error("Données invalides reçues :", data);
          return;
        }
  
        const { dejeuner_diner, petit_dejeuner } = data.data;
  
        // Calcul du total des repas
        const total = dejeuner_diner + petit_dejeuner;
  
        // Éviter la division par zéro
        const dejeunerPourcent = total > 0 ? (dejeuner_diner / total) * 100 : 0;
        const petitDejPourcent = total > 0 ? (petit_dejeuner / total) * 100 : 0;
        if (this.chart2) {
          // Mettre à jour les données du graphique
          this.chart2.data.datasets[0].data = [dejeunerPourcent, petitDejPourcent];
          this.chart2.update();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des repas', error);
      });
  }

  // Diagramme circulaire pour la répartition des tickets
  loadDonutChart() {
    this.chart2 = new Chart("donutChart", {
      type: 'doughnut',
      data: {
        labels: ["Tickets dejeuner", "Tickets petit dejeuner"],
        datasets: [{
          data: [], 
          backgroundColor: ["#5a3ffb", "#c62828"],
          hoverBackgroundColor: ["#3a27d3", "#a32121"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "right" }
        }
      }
    });
    this.getDailyMeals();
  }
}
