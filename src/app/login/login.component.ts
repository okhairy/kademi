import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login', // ✅ Indique que c'est un Standalone Component
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, ReactiveFormsModule] // ✅ Importer ici ReactiveFormsModule
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Réinitialiser les messages d'erreur lorsque les champs de saisie sont modifiés
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Connexion réussie', response);
          if (response.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/dashboard-etudiant']);
          }
          // Rediriger l'utilisateur ou effectuer d'autres actions
        },
        error => {
          console.log('Erreur de connexion', error);
          this.errorMessage = error.response?.data?.error || 'Une erreur est survenue lors de la connexion.';
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
