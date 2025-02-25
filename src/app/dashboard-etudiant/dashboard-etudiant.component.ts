import { Component,AfterViewInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-etudiant',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './dashboard-etudiant.component.html',
  styleUrl: './dashboard-etudiant.component.css'
})
export class DashboardEtudiantComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Petit déjeuner', 'Déjeuner', 'Dépôt'],
        datasets: [{
          label: 'Montant en CFA',
          data: [50, 100, 3000],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

}
