import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
// Importation de Bootstrap JS
declare var bootstrap: any;

@Component({
  selector: 'app-modification-utilisateur',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './modification-utilisateur.component.html',
  styleUrl: './modification-utilisateur.component.css'
})
export class ModificationUtilisateurComponent implements OnInit {
  @Input() userId!: string;
  @Input() userRole!: string;
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
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  

  ngOnInit(): void {
    const id = this.userId || this.route.snapshot.paramMap.get('id');
    
    if (id && this.userRole) {
      this.chargerUtilisateur(id, this.userRole);
      
    }

    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      role: ['', Validators.required],
      numero_de_dossier: [''],
      photo: [''],
      lieu: ['']
    });
  }

  chargerUtilisateur(id: string, role: string) {
    this.userService.getUtilisateur(id, role).subscribe(
      (data) => {
        this.utilisateur = data;
        this.userForm.patchValue(data);
        console.log('Utilisateur chargé :', this.utilisateur);
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
            this.message = 'Utilisateur modifié avec succès !';
            this.isSuccess = true; 
            this.ouvrirModal(); // Ouvrir le modal après la modification réussie
          },
          (error) => {
            this.message = 'Erreur lors de la modification. Veuillez réessayer.';
            this.isSuccess = false;
            this.ouvrirModal(); // Ouvrir le modal en cas d'erreur
            console.error('Erreur lors de la modification', error);
          }
        );
    }
  }

  ouvrirModal() {
    this.cdRef.detectChanges();

    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    this.closeEdit.emit(); // Déplacez cette ligne après l'ouverture du modal
  }

  fermerModal() {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }  
  
    close() {
      this.closeEdit.emit(); 
      this.router.navigate(['/user']); // ✅ Redirection si on annule
    }
}