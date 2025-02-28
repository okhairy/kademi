import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
    selector: 'app-login', // ✅ Indique que c'est un Standalone Component
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [CommonModule, ReactiveFormsModule, BrowserModule, NgIf] // ✅ Importer ici ReactiveFormsModule
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  

  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Connexion réussie', this.loginForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
