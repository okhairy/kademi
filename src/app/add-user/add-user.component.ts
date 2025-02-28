import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  @Output() closeForm = new EventEmitter<void>();

  close() {
    this.closeForm.emit();
  }
  userForm: FormGroup;
  selectedRole: string = '';

  constructor(private fb: FormBuilder,private router: Router) {
    this.userForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^(70|75|76|77|78)\d{7}$/) // Numéro valide
      ]],
      role: ['', Validators.required],
      numeroDossier: [''], // Ajouté pour étudiant
      photo: [''], // Ajouté pour étudiant
      lieu: [''], // Ajouté pour vigile
      chambre: [''], 
      campus: [''] 
    });
     // Écouter les changements du rôle pour afficher les champs dynamiquement
     this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole = role;

      if (role === 'etudiant') {
        this.userForm.get('numeroDossier')?.setValidators([Validators.required]);
        this.userForm.get('chambre')?.setValidators([Validators.required]);
        this.userForm.get('campus')?.setValidators([Validators.required]);
        this.userForm.get('lieu')?.clearValidators();
      } else if (role === 'vigile') {
        this.userForm.get('lieu')?.setValidators([Validators.required]);
        this.userForm.get('numeroDossier')?.clearValidators();
        this.userForm.get('chambre')?.clearValidators();
        this.userForm.get('campus')?.clearValidators();
      } else {
        this.userForm.get('numeroDossier')?.clearValidators();
        this.userForm.get('lieu')?.clearValidators();
        this.userForm.get('chambre')?.clearValidators();
        this.userForm.get('campus')?.clearValidators();
      }

      this.userForm.get('numeroDossier')?.updateValueAndValidity();
      this.userForm.get('chambre')?.updateValueAndValidity();
      this.userForm.get('campus')?.updateValueAndValidity();
      this.userForm.get('lieu')?.updateValueAndValidity();
    });
  }
  submitForm() {
    if (this.userForm.valid) {
      console.log("Utilisateur ajouté :", this.userForm.value);
    } else {
      console.log("Formulaire invalide !");
      this.userForm.markAllAsTouched();
    }
  }
  //
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
