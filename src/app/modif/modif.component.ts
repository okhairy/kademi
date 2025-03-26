import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { EtudiantService } from '../services/etudiant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Ajout pour la navigation

@Component({
  selector: 'app-modif',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modif.component.html',
  styleUrl: './modif.component.css'
})
export class ModifComponent  {
  isEditing: boolean = false;
  etudiant: any = {}; // Enlever @Input()

  constructor(
    private etudiantService: EtudiantService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private router: Router // Pour redirection
  ) {}

 /*  ngOnInit(): void {
    this.chargerUtilisateurConnecte();
  }

/*   chargerUtilisateurConnecte(): void {
    this.userService.getUtilisateurConnecte().subscribe(user => {
      if (user && user.id) {
        this.chargerEtudiant(user.id);
      }
    });
  } */

/*   chargerEtudiant(etudiantId: number): void {
    this.etudiantService.getEtudiant(etudiantId).subscribe(data => {
      this.etudiant = data;
    });
  }

  modifier(): void {
    this.isEditing = true;
  }

  enregistrer(): void {
    this.etudiantService.updateEtudiant(this.etudiant.id, this.etudiant).subscribe(() => {
      this.isEditing = false;
      this.router.navigate(['/dashboard']); 
  } 
} */
} 