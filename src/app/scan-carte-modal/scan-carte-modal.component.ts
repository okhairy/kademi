import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-scan-carte-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-carte-modal.component.html',
  styleUrls: ['./scan-carte-modal.component.css']
})export class ScanCarteModalComponent {
  @Input() user: any;  // L'utilisateur sélectionné
  @Output() close = new EventEmitter<void>();

  cardUid: string = '';
  isCardScanned: boolean = false;
  errorMessage: string | null = null; // Variable pour stocker les messages d'erreur
  private socket: WebSocket | null = null;

  constructor() {
    this.connectToWebSocket();
  }

  // Connexion au WebSocket
  // Connexion au WebSocket
  connectToWebSocket() {
    this.socket = new WebSocket('ws://localhost:8081');

    this.socket.onopen = () => {
      console.log("🟢 Connecté au WebSocket.");
      if (this.socket) {  // Vérifier si socket n'est pas null avant d'envoyer
        if (this.user && this.user.id) {
          const message = {
            action: 'setStudentId',
            studentId: this.user.id,
          };
          this.socket.send(JSON.stringify(message));
          console.log("🆔 ID de l'étudiant envoyé :", this.user.id);
        }
      }
    };

    // Écouter les messages du WebSocket
    this.socket.onmessage = (event) => {
      const rawData = event.data; // Reçoit la donnée brute (par exemple, "D3C1BC2E")

      // Vérifier si la donnée est une chaîne de caractères valide
      if (typeof rawData === 'string' && rawData.trim() !== '') {
        this.cardUid = rawData.trim(); // Mettre à jour l'UID de la carte
        this.isCardScanned = true;    // Mettre à jour isCardScanned
        console.log("🟢 Carte scannée :", this.cardUid);
        
        // Demander à l'utilisateur si la carte doit être assignée
        this.confirmerAssignerCarte();
      } else {
        console.error("❌ Donnée reçue invalide :", rawData);
      }
    };
  }

  // Demander à l'utilisateur si la carte doit être assignée
  confirmerAssignerCarte() {
    Swal.fire({
      title: 'Carte scannée',
      text: `La carte ${this.cardUid} a été scannée. Voulez-vous l\'assigner à l\'étudiant ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.assignerCarte(); // Si l'utilisateur confirme, on assigne la carte
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Action annulée',
          text: 'La carte n\'a pas été assignée.',
        });
      }
    });
  }

  // Envoyer la carte scannée à Laravel
  assignerCarte() {
    // Réinitialiser le message d'erreur
    this.errorMessage = null;

    if (!this.cardUid) {
      this.errorMessage = 'Veuillez scanner une carte RFID !';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: this.errorMessage,
      });
      return;
    }

    const studentId = this.user?.id;

    if (!studentId) {
      this.errorMessage = '❌ Aucun ID d\'étudiant sélectionné.';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: this.errorMessage,
      });
      return;
    }

    const url = `http://127.0.0.1:8000/api/assigner-carte/${studentId}`;
    
    const body = { uid_carte: this.cardUid };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => {
        console.log("Réponse brute :", response);

        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // Si c'est du JSON, on le traite comme tel
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.message || 'Erreur inconnue');
            });
          }
          return response.json();
        } else {
          // Si ce n'est pas du JSON, on traite comme du texte
          return response.text().then(text => {
            if (!response.ok) {
              // Si la réponse contient du HTML, extraire un message plus précis
              if (text.includes('<!DOCTYPE')) {
                throw new Error('Le serveur a retourné une page HTML au lieu de JSON. Vérifiez la configuration du serveur.');
              }
              throw new Error(text || 'Erreur de communication avec le serveur');
            }
            return { success: true, message: text };
          });
        }
      })
      .then(data => {
        console.log("✅ Réponse Laravel :", data);
        this.isCardScanned = true;
        
        // Afficher un message de succès
        Swal.fire({
          icon: 'success',
          title: 'Carte assignée avec succès!',
          text: 'La carte RFID a été correctement assignée à l\'étudiant.',
        });
      })
      .catch(error => {
        console.error("❌ Erreur :", error);
        this.errorMessage = "Erreur lors de l'assignation de la carte : " + error.message;

        // Afficher l'erreur avec SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: this.errorMessage,
        });
      });
  }

  // Fermer le modal
  closeModal() {
    this.close.emit();
  }
}

  // Fermer le modal
 /*  closeModal() {
    this.close.emit();
  }
} */
