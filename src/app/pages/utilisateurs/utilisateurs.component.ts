import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule,SidebarComponent,FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  constructor(private router: Router,private modalService: NgbModal) {}
  searchTerm: string = '';
  users = [
    { nom: 'Karen Hope', id: '#123456789', date: 'March 25, 2021', role: 'etudiant', email: 'karenhope@gmail.com', selected: false, assigned: false },
    { nom: 'Jordan Nico', id: '#123456789', date: 'March 25, 2021', role: 'etudiant', email: 'jordannico@gmail.com', selected: false, assigned: true },
    { nom: 'Nadila Adja', id: '#123456789', date: 'March 25, 2021', role: 'Vigile', email: 'nadilaadja@gmail.com', selected: false },
    { nom: 'Johnny Ahmad', id: '#123456789', date: 'March 25, 2021', role: 'Vigile', email: 'johnyahmad@gmail.com', selected: false },
    { nom: 'oumoul Adja', id: '#123456789', date: 'March 25, 2021', role: 'Vigile', email: 'nadilaadja@gmail.com', selected: false },
    { nom: 'Johnny Ahmad', id: '#123456789', date: 'March 25, 2021', role: 'Vigile', email: 'johnyahmad@gmail.com', selected: false }
  ];
  showModal = false;
  showDeleteModal = false; // Modal pour la suppression
  userToDelete: any = null;
  utilisateurId!: number;
  filteredUsers = [...this.users];
  showBlockModal = false;  // Modal pour le blocage
  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.id.toString().includes(term) ||
      user.nom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.date.includes(term)
    );
  }
  toggleAssign(user: any) {
    user.assigned = !user.assigned;
    alert(`L'étudiant ${user.nom} est maintenant ${user.assigned ? 'assigné' : 'désassigné'} !`);
    // Ici, ajoute la logique pour mettre à jour l'état dans la base de données
  }
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.users.forEach(user => user.selected = isChecked);
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
  //

  goToAddUser() {
    this.router.navigate(['/inscription']);
  }
  //methode pour supprimer un utilisateur
  confirmDelete(user: any) {
    this.userToDelete = user;
    this.showModal = true;
  }

 /*  deleteUser() {
    if (this.userToDelete) {
      this.users = this.users.filter(u => u !== this.userToDelete);
      this.filteredUsers = [...this.users];
      this.closeModal();
    }
  } */

  closeModal() {
    this.showModal = false;
    this.userToDelete = null;
  }
  //methode pour modifier un utilisateur
  modifierUtilisateur(id: string) {
    this.router.navigate(['/modification', Number(id)]);
  }
  // Ouvrir/Fermer le modal de suppression
  openDeleteModal() {
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
  }
  deleteUser() {
    alert("L'utilisateur a été supprimé !");
    this.closeDeleteModal();
  }

  // Ouvrir/Fermer le modal de blocage
  openBlockModal() {
    this.showBlockModal = true;
  }
  closeBlockModal() {
    this.showBlockModal = false;
  }
  bloquerUtilisateur() {
    alert("L'utilisateur a été bloqué !");
    this.closeBlockModal();
  }

}
