import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-sidebar',
    standalone:true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currentRoute: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }
  
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
