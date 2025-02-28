import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    imports: [ReactiveFormsModule, CommonModule, NgIf],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Email:', this.forgotPasswordForm.value.email);
      // Appeler ici le service d'envoi du lien de réinitialisation
    }
  }

  goBack() {
    // Redirection vers la page de connexion
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

}
