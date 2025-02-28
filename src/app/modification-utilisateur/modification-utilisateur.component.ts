import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modification-utilisateur',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './modification-utilisateur.component.html',
  styleUrl: './modification-utilisateur.component.css'
})
export class ModificationUtilisateurComponent implements OnInit {
  @Input() utilisateur: any; // L'utilisateur à modifier
  @Input() user: any;
  @Output() closeEdit = new EventEmitter<void>();

  close() {
    this.closeEdit.emit();
  }
  modificationForm!: FormGroup;
  userForm!: FormGroup;
  utilisateurId!: string;
  
  constructor(private fb: FormBuilder,private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    this.modificationForm = this.fb.group({
      nom: [this.utilisateur?.nom, Validators.required],
      email: [this.utilisateur?.email, [Validators.required, Validators.email]],
      role: [this.utilisateur?.role, Validators.required],
      date: [this.utilisateur?.date],
      id: [this.utilisateur?.id]
    });
  }

  // Met à jour les informations de l'utilisateur
  modifierUtilisateur() {
    if (this.modificationForm.valid) {
      console.log('Utilisateur modifié :', this.modificationForm.value);
      // Implémentez la logique pour enregistrer les modifications
    }
  }
  submitForm() {
    console.log('Utilisateur modifié :', this.userForm.value);
  }
  //methode pour annuler la modification
  annuler() {
    this.router.navigate(['/user']); // Redirige vers le composant utilisateur
  }
 
}
