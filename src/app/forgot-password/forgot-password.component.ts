import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    imports: [ReactiveFormsModule, CommonModule, NgIf],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isEmailSent: boolean = false;
  isResendDisabled: boolean = false;
  resendCountdown: number = 0;
  attempts: number = 0;
  maxDelay: number = 15; // Premier délai en secondes
  

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Email:', this.forgotPasswordForm.value.email);
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        (response) => {
          console.log('Réponse:', response);
          if (response.data.message) {
            console.log('Message:', response.message);
            // Redirection vers la page de connexion
            this.isEmailSent = true; // Afficher le message de succès
            this.disableResendButton();
          }
        },
        (error) => {
          console.log('Erreur:', error);
        }
      );
      // Appeler ici le service d'envoi du lien de réinitialisation
    }
  }

  disableResendButton() {
    this.isResendDisabled = true;
    this.resendCountdown = this.maxDelay;
    
    let interval = setInterval(() => {
      this.resendCountdown--;

      if (this.resendCountdown <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  goBack() {
    // Redirection vers la page de connexion
    this.router.navigate(['/login']);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  resendEmail() {
    if (!this.isResendDisabled) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        () => {
          this.attempts++; // Augmenter le compteur des tentatives
          if (this.attempts >= 2) {
            this.maxDelay = 600; // Désactiver pendant 10 minutes après 2 essais
          }
          this.disableResendButton();
        },
        (error) => {
          console.log('Erreur lors du renvoi de l\'email:', error);
        }
      );
    }
  }

}
