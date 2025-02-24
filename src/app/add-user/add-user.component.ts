import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^(70|75|76|77|78)\d{7}$/) // Numéro valide
      ]],
      role: ['', Validators.required]
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
}
