import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-change-my-pwd',
  imports: [ CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './change-my-pwd.component.html',
  styleUrl: './change-my-pwd.component.css'
})
export class ChangeMyPwdComponent {
  changePasswordForm!: FormGroup;
    newPasswordVisible: boolean = false;
    confirmPasswordVisible: boolean = false;
    oldPasswordVisible: boolean = false;
    token: string = ''; // Stocke le token extrait de l'URL
    errorMessage: string = '';
    successMessage: string = '';
    isResetSuccessful: boolean = false;

    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
      this.changePasswordForm = this.fb.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/), // doit contenir au moins une lettre majuscule
          Validators.pattern(/[a-z]/), // doit contenir au moins une lettre minuscule
          Validators.pattern(/[0-9]/), // doit contenir au moins un chiffre
          Validators.pattern(/[@$!%*?&]/) // doit contenir au moins un caractère spécial
        ]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: this.passwordMatchValidator });
    }
      // Validator to check if the new password and confirm password fields match
      passwordMatchValidator(form: FormGroup) {
        return form.get('newPassword')!.value === form.get('confirmPassword')!.value
          ? null : { mismatch: true };
      }

      navigateToLogin() {
        this.router.navigate(['/modifprofile']);
      }
    
      toggleNewPasswordVisibility() {
        this.newPasswordVisible = !this.newPasswordVisible;
      }

      toggleOldPasswordVisibility() {
        this.oldPasswordVisible = !this.oldPasswordVisible;
      }
    
      toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
      }

      onSubmit() {
        if (this.changePasswordForm.valid) {
          const passwordData = {
            ancien_password: this.changePasswordForm.value.oldPassword,  // Champ pour l'ancien mot de passe
            nouveau_password: this.changePasswordForm.value.newPassword, // Nouveau mot de passe
            nouveau_password_confirmation: this.changePasswordForm.value.confirmPassword // Confirmation
          };
      
          this.authService.changePassword(passwordData).subscribe({
            next: (response) => {
              this.isResetSuccessful = true;
              this.successMessage = response.data?.message || "Mot de passe changé avec succès."; // Message de succès
              this.errorMessage = '';
              console.log('Réponse:', response);
            },
            error: (error) => {
              this.errorMessage = error?.response?.data?.message || "Erreur lors du changement de mot de passe.";
              this.isResetSuccessful = false;
              console.error('Erreur:', error);
            }
          });
        }
      }
      

}


