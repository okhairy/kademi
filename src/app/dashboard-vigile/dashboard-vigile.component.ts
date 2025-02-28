import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-vigile',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-vigile.component.html',
  styleUrl: './dashboard-vigile.component.css'
})
export class DashboardVigileComponent {
  constructor(private router: Router) {}

  logout() {
    // Ajoutez ici la logique de déconnexion si nécessaire
    this.router.navigate(['/login']);
  }
}
