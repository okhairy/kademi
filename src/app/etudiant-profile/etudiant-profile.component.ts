import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-etudiant-profile',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './etudiant-profile.component.html',
  styleUrls: ['./etudiant-profile.component.css']
})
export class EtudiantProfileComponent implements OnInit {
  etudiantForm!: FormGroup;
  etudiant: any = {};
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {}


  ngOnInit(): void {
    this.chargerEtudiant();
  }

  chargerEtudiant() {
    this.userService.getEtudiantConnecte().subscribe(
      (data) => {
        this.etudiant = data;
        this.etudiantForm = this.fb.group({
          nom: [data.nom],
          prenom: [data.prenom],
          email: [data.email],
          numero_de_dossier: [data.numero_de_dossier]
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des informations', error);
      }
    );
  }

  modifierEtudiant() {
    if (this.etudiantForm.valid) {
      this.userService.modifierEtudiant(this.etudiant.id, this.etudiantForm.value).subscribe(
        (response) => {
          alert('Informations mises à jour avec succès !');
          this.chargerEtudiant(); // Rafraîchir les données après la modification
        },
        (error) => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }
  }
  bloquerCarte() {
    if (confirm("Voulez-vous vraiment bloquer la carte de cet étudiant ?")) {
      alert("Carte bloquée avec succès !");
      // Ajoute ici l'appel à ton service si nécessaire
    }
  }
  retournerDashboard() {
    this.router.navigate(['/dashboard-etudiant']); // Redirige vers le Dashboard
  }
  
  
}
