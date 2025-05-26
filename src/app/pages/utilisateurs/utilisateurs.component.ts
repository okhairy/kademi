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
import { ScanCarteModalComponent } from '../../scan-carte-modal/scan-carte-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule, AddUserComponent, ModificationUtilisateurComponent,ScanCarteModalComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css'
})
export class UtilisateursComponent {
  constructor(private router: Router,private modalService: NgbModal,private userservice:UserService,private cdRef: ChangeDetectorRef) {}
  searchTerm: string = '';
  users: any[] = []; // Déclare la propriété users
  filteredUsers: any[] = []; // Pour gérer la recherche
  selectedUser: any;
  userRoleToBlock: string = '';


  
  
  chargerUtilisateurs() {
    this.userservice.getUtilisateurs().subscribe(users => {

       // Tri du plus récent au plus ancien
      users.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      this.users = users; // Remplace la liste statique par les données récupérées
      this.filteredUsers = [...this.users]; // Pour la recherche
      console.log('Liste des utilisateurs:', this.users); 
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
      user.prenom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.date.includes(term)
    );
    this.currentPage = 1; // Réinitialiser à la première page après la recherche
  }
  toggleAssign(user: any) {
    if (user.assignation === 'Désassigné') {
      this.userservice.assignerCarte(user.id).subscribe(response => {
        user.assignation = 'Assigné'; // Met à jour l'affichage
        alert(`L'étudiant ${user.nom} a été assigné !`);
      });
    } else {
      this.userservice.desassignerCarte(user.id).subscribe(response => {
        user.assignation = 'Désassigné'; // Met à jour l'affichage
        alert(`L'étudiant ${user.nom} a été désassigné !`);
      });
    }
  }
  
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.users.forEach(user => user.selected = isChecked);
  } 

  currentPage = 1;
  usersPerPage = 16;
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

  toggleBlocage(user: any) {
  const id = user.id;
  const role = (user.role || 'etudiant').toLowerCase();

  const action = user.statut === 'bloqué' ? 'débloquer' : 'bloquer';
  const message = `Voulez-vous vraiment ${action} cet utilisateur ?`;

  Swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur`,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
  }).then((result) => {
    if (result.isConfirmed) {
      this.userservice.toggleBlocage(id, role, user.statut).subscribe({
        next: () => {
          this.message = `Utilisateur ${action} avec succès !`;
          this.isSuccess = true;
          this.showMessageModal = true;
          this.chargerUtilisateurs(); // 🔄 refresh
        },
        error: () => {
          this.message = `Erreur lors de la tentative de ${action}.`;
          this.isSuccess = false;
          this.showMessageModal = true;
        }
      });
    }
  });
}


  // Ouvrir/Fermer le modal de blocage
  openBlockModal(userId: number, role: string) {
    this.userIdToBlock = userId;
    this.userRoleToBlock = role.toLowerCase(); 
    this.showBlockModal = true;
  }

  closeBlockModal() {
    this.showBlockModal = false;
    this.userIdToBlock = null;
  }

  bloquerUtilisateur() {
  if (this.userIdToBlock !== null && this.userRoleToBlock) {
    this.userservice.bloquerUtilisateur(this.userIdToBlock, this.userRoleToBlock.toLowerCase()).subscribe({
      next: () => {
        this.isSuccess = true;
        this.message = "L'utilisateur a été bloqué avec succès.";
        this.chargerUtilisateurs();
      },
      error: () => {
        this.isSuccess = false;
        this.message = "Une erreur s'est produite lors du blocage.";
      },
      complete: () => {
        this.showBlockModal = false;
        this.showMessageModal = true;
        this.userIdToBlock = null;
        this.userRoleToBlock = '';
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
      this.chargerUtilisateurs(); 
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

deleteSelectedUsers() {
  this.filteredUsers = this.filteredUsers.filter(user => !user.selected);
  this.updateSelection();
  this.showDeleteMultipleModal = false;
}
openDeleteMultipleModal() {
  this.showDeleteMultipleModal = true;
}

closeDeleteMultipleModal() {
  this.showDeleteMultipleModal = false;
  this.chargerUtilisateurs(); 
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
  this.chargerUtilisateurs(); 

  document.body.classList.remove('modal-open');
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(b => b.remove());
}
showScanCarteModal = false;
/* selectedUser: any; */

// Ouvrir le modal de scan de carte
openScanCarteModal(user: any): void {
  if (user.assignation === 'Assigné') {
    // Si déjà assigné, appeler la méthode de désassignation
    this.desassignerCarte(user);
  } else {
    // Sinon, ouvrir le modal pour scanner la carte
    this.selectedUser = user;  // Sauvegarder l'utilisateur sélectionné pour la suite
    this.showScanCarteModal = true;
  }
}

// Méthode pour assignee une carte à un utilisateur
assignerCarte(user: any) {
  // Appelle ton service pour assigner la carte
  this.userservice.assignerCarte(user.id).subscribe(response => {
    this.showMessageModal = true;
    this.message = "Carte assignée avec succès!";
    this.isSuccess = true;
    user.assignation = 'Assigné'; // Mise à jour de l'état de l'utilisateur
    this.chargerUtilisateurs(); 
  }, error => {
    this.showMessageModal = true;
    this.message = "Erreur lors de l'assignation de la carte.";
    this.isSuccess = false;
  });
}

// Méthode pour désassigner une carte d'un utilisateur
desassignerCarte(user: any) {
  // Confirmation avant désassignation (facultatif)
  Swal.fire({
    title: 'Désassigner la carte',
    text: 'Êtes-vous sûr de vouloir désassigner la carte de cet étudiant ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
  }).then((result) => {
    if (result.isConfirmed) {
      // Appelle ton service pour désassigner la carte
      this.userservice.desassignerCarte(user.id).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Carte désassignée avec succès!',
            text: 'La carte RFID a été désassignée de létudiant.',
          }).then(() => {
            // Rafraîchir la page après la désassignation
            window.location.reload();
          });

          user.assignation = 'Non assigné'; // Mise à jour de l'état de l'utilisateur
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Erreur lors de la désassignation de la carte : " + (error.error?.message || error.message || 'Erreur inconnue'),
          });
        }
      });
    }
  });
}

// Ajouter cette méthode pour gérer l'événement d'assignation réussie
onCarteAssignee() {
  console.log("🔄 La carte a été assignée, rafraîchissement des données...");
  // Vous pouvez aussi mettre à jour vos données ici au lieu de recharger toute la page
  // Par exemple, récupérer à nouveau la liste des utilisateurs depuis votre API
}


// Fermer le modal de scan de carte
closeScanCarteModal() {
  this.showScanCarteModal = false;
  this.selectedUser = null;
  this.chargerUtilisateurs(); 
}
}
