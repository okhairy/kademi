import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard-admin',
    imports: [SidebarComponent],
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements AfterViewInit {
  
  ngAfterViewInit() {
    this.loadBarChart();
    this.loadDonutChart();
  }

  // Histogramme des achats de tickets par mois
  loadBarChart() {
    new Chart("barChart", {
      type: 'bar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Achats de tickets",
          data: [30, 40, 35, 20, 25, 30, 28, 50, 40, 38, 45, 42],
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
  }

  // Diagramme circulaire pour la répartition des tickets
  loadDonutChart() {
    new Chart("donutChart", {
      type: 'doughnut',
      data: {
        labels: ["Tickets dejeuner", "Tickets petit dejeuner"],
        datasets: [{
          data: [75, 25], // 75% et 25%
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
  }
}
