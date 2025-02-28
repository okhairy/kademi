import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Indique que c'est un Standalone Component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // ✅ Importer ici ReactiveFormsModule
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Connexion réussie', response);
          // Rediriger l'utilisateur ou effectuer d'autres actions
        },
        error => {
          console.log('Erreur de connexion', error);
          this.errorMessage = error.error.message || 'Une erreur est survenue lors de la connexion.';
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
