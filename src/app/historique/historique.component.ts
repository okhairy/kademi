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
  usersPerPage = 16;
  filteredUsers: any[] = [];

  constructor(private historiqueService: UserService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): any {
    this.historiqueService.getTransactions().subscribe(
      (data) => {
        console.log('Transactions reçues :', data); // Vérification ici
        data.transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.transactions = data.transactions // Assurez-vous que c'est un tableau
        this.filteredUsers = [...this.transactions]; // Initialiser filteredUsers
      },
      (error) => {
        console.error('Erreur lors de la récupération des transactions', error);
        this.transactions = []; // Éviter les erreurs en cas d'échec de récupération
      }
    );
  }
  

  getFilteredUsers(): any[] {
    if (!this.searchTerm) {
      return this.transactions;
    }

    return this.transactions.filter(transaction =>
      transaction.id.toString().includes(this.searchTerm) ||
      transaction.montant.toString().includes(this.searchTerm.toLowerCase()) ||
      transaction.operateur?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      transaction.date.includes(this.searchTerm)
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
    const filtered = this.getFilteredUsers();
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    return filtered.slice(startIndex, startIndex + this.usersPerPage);
  }

  totalPages() {
    return Math.ceil(this.getFilteredUsers().length / this.usersPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
