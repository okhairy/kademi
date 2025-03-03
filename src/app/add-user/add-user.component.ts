import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule,NgxPaginationModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent   {
  @Output() closeForm = new EventEmitter<void>();
  userForm: FormGroup;
  selectedRole: string = '';
  modalTitle: string = '';
  modalMessage: string = '';

 


  constructor(private fb: FormBuilder, private router: Router, private utilisateurService: UserService) { 
    
    this.userForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^(70|75|76|77|78)\d{7}$/) // Numéro valide
      ]],
      role: ['', Validators.required],
      numero_de_dossier: ['', [
        Validators.pattern(/^\d+$/) // Vérifie que c'est un entier
      ]], 
      photo: [''], // Pour étudiant
      lieu: [''], // Pour vigile
      chambre: ['', [
        Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9 ]*$/), // Lettres, chiffres, espaces (pas d’espace en début)
        Validators.pattern(/^(?!.*  ).*$/) // Pas d’espaces consécutifs
      ]]
      /* campus: [''] */
    });

    // Gestion dynamique des champs selon le rôle
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole = role;
      if (role === 'etudiant') {
       this.userForm.get('numero_de_dossier')?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
        this.userForm.get('chambre')?.setValidators([
          Validators.required, 
          Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9 ]*$/), 
          Validators.pattern(/^(?!.*  ).*$/)
        ]);
        /* this.userForm.get('campus')?.setValidators([Validators.required]); */
        this.userForm.get('lieu')?.clearValidators();
      } else if (role === 'vigile') {
        this.userForm.get('lieu')?.setValidators([Validators.required]);
        this.userForm.get('numero_de_dossier')?.clearValidators();
        this.userForm.get('chambre')?.clearValidators();
     /*    this.userForm.get('campus')?.clearValidators(); */
      } else {
        this.userForm.get('numero_de_dossier')?.clearValidators();
        this.userForm.get('lieu')?.clearValidators();
        this.userForm.get('chambre')?.clearValidators();
        /* this.userForm.get('campus')?.clearValidators(); */
      }

      this.userForm.get('numero_de_dossier')?.updateValueAndValidity();
      this.userForm.get('chambre')?.updateValueAndValidity();
     /*  this.userForm.get('campus')?.updateValueAndValidity(); */
      this.userForm.get('lieu')?.updateValueAndValidity();
    });
  
  }
   // Charger les utilisateurs avec pagination
  
  

  close() {
    this.closeForm.emit();
  }

  submitForm() {
    if (this.userForm.valid) {
      this.utilisateurService.ajouterUtilisateur(this.userForm.value).subscribe({
        next: (response) => {
          this.modalTitle = 'Inscription Réussie 🎉';
          this.modalMessage = 'Votre inscription a été effectuée avec succès.';
          this.openModal();
          this.userForm.reset(); // Réinitialiser le formulaire après l'ajout
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
          this.modalTitle = 'Inscription Échouée ❌';
          this.modalMessage = 'Une erreur est survenue lors de l\'ajout.';
          this.openModal();
        }
      });
    } else {
      this.modalTitle = 'Inscription Échouée ❌';
      this.modalMessage = 'Veuillez remplir tous les champs obligatoires.';
      this.openModal();
    }
  }
  
  openModal() {
    let modalElement = document.getElementById('inscriptionModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-modal', 'true');
      modalElement.removeAttribute('aria-hidden');
    }
  }
  closeModal() {
    let modalElement = document.getElementById('inscriptionModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
    }
  
    // Fermer le formulaire en même temps
    this.close();
  }
  
  
  
  

  errors: any = {}; // Stocke les erreurs de chaque champ

  checkField(field: string) {
    const control = this.userForm.get(field);
    if (control && control.errors) {
      if (control.errors['required']) {
        this.errors[field] = 'Ce champ est obligatoire.';
      } else if (control.errors['minlength']) {
        this.errors[field] = `Minimum ${control.errors['minlength'].requiredLength} caractères.`;
      } else if (control.errors['email']) {
        this.errors[field] = 'Email invalide.';
      } else if (control.errors['pattern']) {
        this.errors[field] = 'Format incorrect.';
      } else {
        this.errors[field] = '';
      }
    } else {
      this.errors[field] = '';
    }
  }
  
}
function closeModal() {
  let modalElement = document.getElementById('inscriptionModal');
  if (modalElement) {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
  }
}

