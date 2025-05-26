import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface Student {
  prenom: string;
  nom: string;
  role: string;
  telephone: string;
  numeroDossier: string;
  email: string;
}

@Component({
  selector: 'app-modifier-etudiant',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './modifier-etudiant.component.html',
  styleUrls: ['./modifier-etudiant.component.css']
})
export class ModifierEtudiantComponent implements OnInit {
  student: Student = {
    prenom: 'Nabila',
    nom: 'Agne',
    role: 'Étudiant',
    telephone: '76034961',
    numeroDossier: '202300045',
    email: 'nabila@gmail.com'
  };

  constructor() { }

  ngOnInit(): void {
  }

  resetPassword(): void {
    // Logic to reset password
    console.log('Reset password requested');
  }

  returnToDashboard(): void {
    // Navigation logic
    console.log('Return to dashboard requested');
  }
}