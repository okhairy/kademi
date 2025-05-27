import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ NgIf, CommonModule, ReactiveFormsModule ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  token: string = ''; // Stocke le token extrait de l'URL
  errorMessage: string = '';
  successMessage: string = '';
  isResetSuccessful: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.changePasswordForm = this.fb.group({
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

  ngOnInit() {
    // Récupérer le token depuis l'URL
    this.route.paramMap.subscribe(params => {
      const tokenFromUrl = params.get('token');
      if (tokenFromUrl) {
        this.token = tokenFromUrl;
      } else {
        this.errorMessage = "Token invalide ou manquant.";
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid && this.token) {
      const passwordData = {
        token: this.token,
        password: this.changePasswordForm.value.newPassword,
        password_confirmation: this.changePasswordForm.value.confirmPassword
      };

      this.authService.resetPassword(passwordData).subscribe({
        next: (response) => {
          this.isResetSuccessful = true
          this.successMessage = response.message; // Message de succès
          this.errorMessage = '';
          // setTimeout(() => this.router.navigate(['/login']), 3000); // Rediriger après 3s
          console.log('Réponse:', response);
        },
        error: (error) => {
          this.errorMessage = error.response?.data?.message || "Erreur lors de la réinitialisation.";
        }
      });
    }
  }

  navigateToLogin() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
