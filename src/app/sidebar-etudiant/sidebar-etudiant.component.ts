import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-sidebar-etudiant',
    imports: [],
    templateUrl: './sidebar-etudiant.component.html',
    styleUrl: './sidebar-etudiant.component.css'
})
export class SidebarEtudiantComponent {

    constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        // Rediriger vers la page de connexion après une déconnexion réussie
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }
}
