import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-modification-utilisateur',
    imports: [ReactiveFormsModule, CommonModule, NgIf],
    templateUrl: './modification-utilisateur.component.html',
    styleUrl: './modification-utilisateur.component.css'
})
export class ModificationUtilisateurComponent implements OnInit {
  @Input() userId!: string;
  @Output() closeEdit = new EventEmitter<void>();

  userForm!: FormGroup;
  utilisateur: any;
  /* message!: string; */ // Message affiché dans le modal
  isSuccess!: boolean; // Indique si c'est un succès ou une erreur
  showModal: boolean = false; // Gère l'affichage du modal
  showForm: boolean = true; // ✅ Affiche le formulaire au départ
  
    message: string = ''; // Message à afficher dans le modal

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.userId || this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.chargerUtilisateur(id);
    }

    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      role: ['', Validators.required],
      numeroDossier: [''],
      photo: [''],
      lieu: ['']
    });
  }

  chargerUtilisateur(id: string) {
    this.userService.getUtilisateur(id).subscribe(
      (data) => {
        this.utilisateur = data;
        this.userForm.patchValue(data);
      },
      (error) => {
        console.error('Erreur lors du chargement de l’utilisateur', error);
      }
    );
  }

  modifierUtilisateur() {
    if (this.userForm.valid) {
        this.userService.modifierUtilisateur(this.utilisateur.id, this.userForm.value)
            .subscribe(
                () => {
                    // Succès
                    this.message = 'Utilisateur modifié avec succès !';
                    this.isSuccess = true;
                    this.showModal = true; // Affiche le modal
                    console.log('Utilisateur modifié avec succès !');
                    console.log('Message:', this.message);
                },
                (error) => {
                    // Erreur
                    this.message = 'Erreur lors de la modification. Veuillez réessayer.';
                    this.isSuccess = false;
                    this.showModal = true; // Affiche le modal
                    console.error('Erreur lors de la modification', error);
                    console.log('Message:', this.message);
                }
            );
    }
}

  // Ferme le modal et le formulaire
/*   fermerModal() {
    this.showModal = false;
    this.showForm = false; // Cache le formulaire
    this.closeEdit.emit(); // Ferme le composant
  }
  close() {
    this.showForm = false; // Cache le formulaire lors du clic sur Annuler
    this.closeEdit.emit();
  } */
    fermerModal() {
      this.showModal = false;
      /* this.router.navigate(['/user']); */ // ✅ Redirection si on ferme le modal
    }
  
    close() {
      this.closeEdit.emit(); 
      this.router.navigate(['/user']); // ✅ Redirection si on annule
    }
}