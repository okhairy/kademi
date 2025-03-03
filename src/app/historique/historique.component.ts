import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {
  transactions: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  usersPerPage = 5;

  constructor(private historiqueService: UserService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.historiqueService.getTransactions().subscribe(
      (data) => {
        console.log('Transactions reçues :', data); // Vérification ici
        this.transactions = Array.isArray(data) ? data : []; // Assurez-vous que c'est un tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des transactions', error);
        this.transactions = []; // Éviter les erreurs en cas d'échec de récupération
      }
    );
  }
  

  getFilteredUsers(): any[] {
    if (!this.searchTerm) {
      return this.paginatedUsers;
    }

    return this.paginatedUsers.filter(user =>
      user.id.toString().includes(this.searchTerm) ||
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.date.includes(this.searchTerm)
    );
  }

  getActionClass(action: string): string {
    if (!action) return "bg-red-300 text-white";
    action = action.trim().toLowerCase();

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
        return "bg-gray-400 text-white";
    }
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    return this.transactions.slice(startIndex, startIndex + this.usersPerPage);
  }

  totalPages() {
    return Math.ceil(this.transactions.length / this.usersPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
