import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-historique',
    imports: [SidebarComponent, CommonModule, FormsModule],
    templateUrl: './historique.component.html',
    styleUrl: './historique.component.css'
})
export class HistoriqueComponent {
  users = [
    { id: '2341421', nom: 'Ahmed Rashdan', role: 'etudiant', prenom: 'diop', date: '29 July 2025', action: 'à acheter du déjeuner', heure: '10:30', status: 'active' },
    { id: '3411421', nom: 'Ali Ahmandom', role: 'vigile', prenom: 'faal', date: '29 July 2025', action: 's’est pointé', heure: '18:20', status: 'active' },
    { id: '2341121', nom: 'Mona Alqhtani', role: 'vigile', prenom: 'mbengue', date: '29 July 2025', action: 's’est connecté', heure: '9:40', status: 'inactive' },
    { id: '2341421', nom: 'Moustafa Adel', role: 'etudiant', prenom: 'ndaiye', date: '29 July 2025', action: 'à acheter du déjeuner', heure: '9:40', status: 'inactive' },
    { id: '2341421', nom: 'Jhon Neleon', role: 'etudiant', prenom: 'traoré', date: '29 July 2025', action: 'à acheter du petit déj.', heure: '10:30', status: 'inactive' },
    { id: '2341421', nom: 'Kadi Manela', role: 'etudiant', prenom: 'diop', date: '29 July 2025', action: 'Présent', heure: '9:40', status: 'active' }
  ];
  searchTerm: string = '';
  //methode pour faire une recherche
  getFilteredUsers(): any[] {
    if (!this.searchTerm) {
      return this.paginatedUsers; // Si rien n'est saisi, on affiche tout
    }
  
    return this.paginatedUsers.filter(user =>
      user.id.toString().includes(this.searchTerm) || // Recherche par ID
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || // Recherche par Nom
      user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) || // Recherche par Prénom
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase()) || // Recherche par Rôle
      user.date.includes(this.searchTerm) // Recherche par Date
    );
  }
  
//methode pour une action faite
  getActionClass(action: string): string {
    if (!action) return "bg-red-300 text-white"; // Gérer les valeurs nulles
    action = action.trim().toLowerCase(); // Supprime les espaces et met en minuscule
  
    switch (action) {
      case "s’est pointé":
        return "bg-red-400 text-white ";
      case "s’est connecté":
        return "bg-orange-400 text-white";
      case "à acheter du déjeuner":
        return "bg-blue-500 text-white";
        case "à acheter du petit déj.":
        return "bg-yellow-400 text-white";
      case "présent":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white"; // Couleur par défaut
    }
  }
  
  currentPage = 1;
  usersPerPage = 5;

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    return this.users.slice(startIndex, startIndex + this.usersPerPage);
  }

  totalPages() {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

}
