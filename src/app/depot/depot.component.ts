import { Component, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-depot',
    standalone:true,
    imports: [CommonModule, SidebarEtudiantComponent, FormsModule],
    templateUrl: './depot.component.html',
    styleUrl: './depot.component.css'
})
export class DepotComponent implements OnInit {
  depots: any[] = [];
  utilisateur: any;
  montant: number = 0;
  frais: number = 0;
  montantRecu: number = 0;
  erreurMontant: string = '';
  modalNumeroDepot: any;
  modalDepot: any;
  modalMontantDepot:any;
  modalSaisieNumero:any;
  numeroSaisi: string = '';
  numeroValide: boolean = false;
  operateurSelectionne: string = ''; 
  operateurChoisi: string = ''; // Stocke l'opérateur sélectionné

  page = 1;
  

  constructor(private renderer: Renderer2, private authservice: AuthService) {}

  ngOnInit(): void {
    this.loadDepots();
    this.loadUserData();

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const modalNumero = document.getElementById('numeroDepotModal');
      const modalDepot = document.getElementById('depotModal');
      const modalMontantDepot = document.getElementById('montantDepotModal'); // Ajout du modal de montant
      const modalSaisieNumero = document.getElementById('saisieNumeroModal'); // ID du modal
  
      if (modalNumero) {
        this.modalNumeroDepot = new (window as any).bootstrap.Modal(modalNumero);
      }
      if (modalDepot) {
        this.modalDepot = new (window as any).bootstrap.Modal(modalDepot);
      }
      if (modalMontantDepot) {
        this.modalMontantDepot = new (window as any).bootstrap.Modal(modalMontantDepot);
      }
      if (modalSaisieNumero) {
        this.modalSaisieNumero = new (window as any).bootstrap.Modal(modalSaisieNumero);
      }
    }
  }
  
  loadDepots() {
    this.authservice.getDepots().subscribe(
      (response: any) => {
        console.log("Dépôts reçus :", response);
        if (response?.data.depots) {
          this.depots = response.data.depots.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des dépôts :", error);
      }
    );
  }
  
  loadUserData(): void {
    this.authservice.getUserConnected().subscribe(
      (data) => {
        this.utilisateur = data.data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données de l\'utilisateur', error);
      }
    );
  }

  ouvrirNumeroDepotModal(operateur: string): void {
    this.operateurChoisi = operateur;
    this.fermerModals(); // Ferme tous les modals ouverts avant d'en ouvrir un autre
    if (this.modalNumeroDepot) {
      this.modalNumeroDepot.show();
    }
  }

  ouvrirDepotModal(): void {
    this.fermerModals(); // Ferme tous les modals ouverts avant d'en ouvrir un autre
    if (this.modalDepot) {
      this.modalDepot.show();
    }
  }
  ouvrirMontantDepotModal(): void {
    this.fermerModals(); // Ferme les autres modals avant d'ouvrir le nouveau
    if (this.modalMontantDepot) {
      this.modalMontantDepot.show();
    }
  }
  ouvrirSaisieNumeroModal(operateur: string): void {
    this.operateurChoisi = operateur;
    this.numeroSaisi = ''; // Réinitialise le champ numéro
    this.numeroValide = false; // Réinitialise la validation
    this.fermerModals();

    if (this.modalSaisieNumero) this.modalSaisieNumero.show();
  }

  // Méthode pour choisir un opérateur et ouvrir la saisie du numéro
choisirOperateur(operateur: string): void {
  this.operateurChoisi = operateur; // Stocke l'opérateur choisi
  this.numeroSaisi = ''; // Réinitialise le champ de saisie
  this.numeroValide = false; // Réinitialise la validation
  this.fermerModals();

  if (this.modalNumeroDepot) {
    this.modalNumeroDepot.show();
  }
}
  
  
  
  fermerModals(): void {
    if (this.modalNumeroDepot) {
      this.modalNumeroDepot.hide();
    }
    if (this.modalDepot) {
      this.modalDepot.hide();
    }
    if (this.modalMontantDepot) { // Ajout de la fermeture du modal de montant
      this.modalMontantDepot.hide();
    }
    if (this.modalSaisieNumero) this.modalSaisieNumero.hide();

    // Supprimer les backdrops bloqués
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // Retirer la classe qui empêche de scroller après fermeture
    document.body.classList.remove('modal-open');
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    this.page++;
  }

  calculerMontant() {
    if (this.montant % 50 !== 0) {
      this.erreurMontant = 'Le montant doit être un multiple de 50';
    } else {
      this.erreurMontant = '';
      this.frais = Math.floor(this.montant * 0.01); // Exemple : 1% de frais
      this.montantRecu = this.montant +this.frais;
    }
  }
  validerNumero(): void {
    const regexOperateurs = {
      'Orange Money': /^(77|78)\d{7}$/, // Orange : 77xxxxxxx ou 78xxxxxxx
      'Wave': /^(76)\d{7}$/, // Wave : 76xxxxxxx
      'Free Money': /^(70|75)\d{7}$/ // Free : 70xxxxxxx ou 75xxxxxxx
    } as const; 
  
    this.numeroValide = regexOperateurs[this.operateurChoisi as keyof typeof regexOperateurs]?.test(this.numeroSaisi) ?? false;
  }

  effectuerDepot(): void {
    if (!this.utilisateur || !this.utilisateur.id) {
      console.error("Utilisateur non trouvé !");
      return;
    }
  
    const data = {
      montant: this.montant,
      operateur: this.operateurChoisi
    };
  
    this.authservice.depot(this.utilisateur.id, data).subscribe(
      (response: any) => {
        console.log("Dépôt effectué avec succès :", response);
        this.fermerModals();
        this.loadDepots(); // Rafraîchir la liste des dépôts
        this.loadUserData(); 
      },
      (error) => {
        console.error("Erreur lors du dépôt :", error);
      }
    );
  }
  
  
}
