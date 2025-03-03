import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from '../../add-user/add-user.component';
import { ModificationUtilisateurComponent } from "../../modification-utilisateur/modification-utilisateur.component";
import { UserService } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-utilisateurs',
    imports: [CommonModule, SidebarComponent, FormsModule, AddUserComponent, ModificationUtilisateurComponent],
    templateUrl: './utilisateurs.component.html',
    styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  constructor(private router: Router,private modalService: NgbModal,private userservice:UserService,private cdRef: ChangeDetectorRef) {}
  searchTerm: string = '';
  users: any[] = []; // Déclare la propriété users
  filteredUsers: any[] = []; // Pour gérer la recherche
  selectedUser: any;
  
  
  chargerUtilisateurs() {
    this.userservice.getUtilisateurs().subscribe(users => {
      this.users = users; // Remplace la liste statique par les données récupérées
      this.filteredUsers = [...this.users]; // Pour la recherche
    }, error => {
      console.error('Erreur lors du chargement des utilisateurs', error);
    });
  }
  ngOnInit() {
    this.chargerUtilisateurs();
  }
  
  showDeleteModal: boolean = false;
  userIdToDelete: number | null = null;
  userRoleToDelete: string = '';
  message: string = '';
  isSuccess: boolean = false;
  selectedUsers: any[] = [];


  
  userIdToBlock: number | null = null;
/*  */
  showMessageModal: boolean = false;
  showModal = false;
 /*  showDeleteModal = false; // Modal pour la suppression */
  userToDelete: any = null;
  utilisateurId!: number;
/*   filteredUsers = [...this.users]; */
  showBlockModal = false;  // Modal pour le blocage
  showAddUserModal: boolean = false;
  isSelectionEmpty = true;
  showDeleteMultipleModal: boolean = false;

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.id.toString().includes(term) ||
      user.nom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.date.includes(term)
    );
    this.currentPage = 1; // Réinitialiser à la première page après la recherche
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
    return this.filteredUsers.slice(startIndex, startIndex + this.usersPerPage);
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
   // Ouvrir la modal de confirmation
   // Ouvrir la modal de confirmation de suppression
  openDeleteModal(id: number, role: string) {
    this.userIdToDelete = id;
    this.userRoleToDelete = role;
    this.showDeleteModal = true;
  }

  // Fermer la modal de suppression
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userIdToDelete = null;
    this.userRoleToDelete = '';
  }

  // Fermer la modal du message
  closeMessageModal() {
    this.showMessageModal = false;
    this.message = '';
    this.chargerUtilisateurs(); // Recharge la liste après la suppression
  }

  // Supprimer l'utilisateur
  deleteUser() {
    if (this.userIdToDelete !== null) {
      this.userservice.supprimerUtilisateur(this.userIdToDelete, this.userRoleToDelete)
        .subscribe({
          next: (response) => {
            this.isSuccess = true;
            this.message = 'Utilisateur supprimé avec succès !';
            this.showDeleteModal = false;
            this.showMessageModal = true;
          },
          error: (error) => {
            this.isSuccess = false;
            this.message = 'Erreur lors de la suppression.';
            this.showDeleteModal = false;
            this.showMessageModal = true;
          }
        });
    }
  }


  // Ouvrir/Fermer le modal de blocage
  openBlockModal(userId: number) {
    this.userIdToBlock = userId;
    this.showBlockModal = true;
  }

  closeBlockModal() {
    this.showBlockModal = false;
    this.userIdToBlock = null;
  }

  bloquerUtilisateur() {
    if (this.userIdToBlock !== null) {
      this.userservice.bloquerUtilisateur(this.userIdToBlock).subscribe({
        next: () => {
          this.isSuccess = true;
          this.message = "L'utilisateur a été bloqué avec succès.";
          this.refreshUsers();
        },
        error: () => {
          this.isSuccess = false;
          this.message = "Une erreur s'est produite lors du blocage.";
        },
        complete: () => {
          this.showBlockModal = false;
          this.showMessageModal = true;
        }
      });
    }
  }

 

  refreshUsers() {
    // Ici, récupérer à nouveau les utilisateurs si nécessaire
  }
  
  nouvelUtilisateur = {
      nom: '',
      id: '',
      email: '',
      role: ''
  };

  openAddUserModal() {
      this.showAddUserModal = true;
  }

  closeAddUserModal() {
      this.showAddUserModal = false;
  }

  ajouterUtilisateur() {
    this.userservice.ajouterUtilisateur(this.nouvelUtilisateur).subscribe(
      (response) => {
        console.log("Utilisateur ajouté avec succès :", response);
        this.chargerUtilisateurs(); // Recharger la liste des utilisateurs
        this.closeAddUserModal();
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      }
    );
  }
  
 // Met à jour l'état du bouton "Suppression plusieurs"
updateSelection() {
  this.isSelectionEmpty = !this.filteredUsers.some(user => user.selected);
}



// Supprimer les utilisateurs sélectionnés
/* deleteSelectedUsers() {
  this.filteredUsers = this.filteredUsers.filter(user => !user.selected);
  this.updateSelection();
} */

  // Supprimer les utilisateurs sélectionnés
deleteSelectedUsers() {
  this.filteredUsers = this.filteredUsers.filter(user => !user.selected);
  this.updateSelection();
}
openDeleteMultipleModal() {
  this.showDeleteMultipleModal = true;
}

closeDeleteMultipleModal() {
  this.showDeleteMultipleModal = false;
}

deleteMultipleUsers() {
  // Logique de suppression des utilisateurs sélectionnés
  const usersToDelete = this.filteredUsers.filter(user => user.selected);
  console.log('Utilisateurs à supprimer :', usersToDelete);

  // Suppression dans la liste
  this.filteredUsers = this.filteredUsers.filter(user => !user.selected);
  this.showDeleteMultipleModal = false;
}
showEditUserModal: boolean = false;
userToEdit: any = null;

openEditUserModal(user: any) {
  this.userToEdit = { ...user }; // Cloner l'utilisateur pour éviter les modifications directes
  this.showEditUserModal = true;
}

closeEditUserModal() {
  this.showEditUserModal = false;
  this.userToEdit = null;
}
}
