import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-sidebar',
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
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
