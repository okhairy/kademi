import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Importation de Bootstrap JS
declare var bootstrap: any;

@Component({
  selector: 'app-etudiant-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './etudiant-profile.component.html',
  styleUrls: ['./etudiant-profile.component.css']
})
export class EtudiantProfileComponent implements OnInit {
  etudiantForm!: FormGroup;
  etudiant: any = {};
  carteBloquee: boolean = false;
  message: string = '';
  isSuccess: boolean = false;
messageType: string = 'success'; 
messageModification: string = '';
isProcessing: boolean = false; // Property to track processing state
messageBlocage: string = '';
messageDeblocage: string = '';
isModificationSuccess: boolean = false;
isBlocageSuccess: boolean = false;
isDeblocageSuccess: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.chargerEtudiant();
  }

  chargerEtudiant() {
    this.userService.getEtudiantConnecte().subscribe(
      (data) => {
        this.etudiant = data;
        this.carteBloquee = true ? data.status_carte=='bloqué': false; // Utiliser le champ correct de l'API
        this.etudiantForm = this.fb.group({
          nom: [data.nom],
          prenom: [data.prenom],
          email: [data.email],
          numero_de_dossier: [data.numero_de_dossier]
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des informations', error);
      }
    );
  }
  modifierEtudiant(event: Event) {
    event.preventDefault(); // Empêcher la soumission par défaut
    console.log('Appel de la fonction modifierEtudiant');
    if (this.etudiantForm.valid) {
      this.userService.modifierEtudiant(this.etudiant.id, this.etudiantForm.value).subscribe(
        (response) => {
          this.messageModification = 'Informations mises à jour avec succès !';
          this.isModificationSuccess = true;
          this.chargerEtudiant();
          this.ouvrirModal('modificationModal'); // Ouvrir le modal de modification
        },
        (error) => {
          this.messageModification = 'Une erreur est survenue lors de la mise à jour des informations.';
          this.isModificationSuccess = false;
          console.error('Erreur lors de la mise à jour', error);
          this.ouvrirModal('modificationModal'); // Ouvrir le modal de modification
        }
      );
    }
  }
  
  toggleCarte(): void {
    this.isProcessing = true; // Désactiver le bouton
    if (this.carteBloquee) {
      this.userService.debloquerCarte().subscribe(
        (response) => {
          this.carteBloquee = false; // Mettre à jour l'état localement
          this.messageDeblocage = 'Votre carte a été débloquée avec succès.';
          this.isDeblocageSuccess = true;
          this.ouvrirModal('deblocageModal'); // Ouvrir le modal de déblocage
          this.isProcessing = false; // Réactiver le bouton
        },
        (error) => {
          this.messageDeblocage = 'Une erreur est survenue lors du déblocage de votre carte.';
          this.isDeblocageSuccess = false;
          this.ouvrirModal('deblocageModal'); // Ouvrir le modal de déblocage
          this.isProcessing = false; // Réactiver le bouton
        }
      );
    } else {
      this.userService.bloquerCarte().subscribe(
        (response) => {
          this.carteBloquee = true; // Mettre à jour l'état localement
          this.messageBlocage = 'Votre carte a été bloquée avec succès.';
          this.isBlocageSuccess = true;
          this.ouvrirModal('blocageModal'); // Ouvrir le modal de blocage
          this.isProcessing = false; // Réactiver le bouton
        },
        (error) => {
          this.messageBlocage = 'Une erreur est survenue lors du blocage de votre carte.';
          this.isBlocageSuccess = false;
          this.ouvrirModal('blocageModal'); // Ouvrir le modal de blocage
          this.isProcessing = false; // Réactiver le bouton
        }
      );
    }
  }
  ouvrirModal(modalId: string) {
    console.log('Ouverture du modal : ${modalId}');
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  fermerModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  retournerDashboard() {
    this.router.navigate(['/dashboard-etudiant']);
  }
}