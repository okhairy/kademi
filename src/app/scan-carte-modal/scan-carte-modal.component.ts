import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
})
export class ScanCarteModalComponent {
  @Input() user: any;  // L'utilisateur sélectionné
  @Output() close = new EventEmitter<void>();
  @Output() carteAssignee = new EventEmitter<void>(); // Nouvel émetteur pour signaler l'assignation réussie

  cardUid: string = '';
  isCardScanned: boolean = false;
  errorMessage: string | null = null; // Variable pour stocker les messages d'erreur
  private socket: WebSocket | null = null;

  constructor(private http: HttpClient) { // Injecter HttpClient
    this.connectToWebSocket();
  }

  // Connexion au WebSocket
  connectToWebSocket() {
    this.socket = new WebSocket('ws://localhost:3004');

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
        
        // Assigner directement la carte sans demander confirmation
        this.assignerCarte();
      } else {
        console.error("❌ Donnée reçue invalide :", rawData);
      }
    };

    this.socket.onerror = (error) => {
      console.error("❌ Erreur WebSocket:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: 'Impossible de se connecter au serveur WebSocket.',
      });
    };
  }

  // Envoyer la carte scannée à Laravel en utilisant HttpClient
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

    // En-têtes pour aider avec CORS
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };

    console.log("📤 Envoi de la requête à", url, "avec les données", body);

    // Utiliser HttpClient au lieu de fetch
    this.http.post(url, body, httpOptions)
      .subscribe({
        next: (response: any) => {
          console.log("✅ Réponse Laravel :", response);
          
          // Afficher un message de succès
          Swal.fire({
            icon: 'success',
            title: 'Carte assignée avec succès!',
            text: 'La carte RFID a été correctement assignée à l\'étudiant.',
          }).then(() => {
            // Émettre l'événement pour indiquer que la carte a été assignée
            this.carteAssignee.emit();
            
            // Fermer le modal
            this.closeModal();
            
            // Rafraîchir la page
            window.location.reload();
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error("❌ Erreur :", error);
          
          // Traiter spécifiquement l'erreur 422 (Unprocessable Entity) - carte déjà assignée
          if (error.status === 422) {
            let message = 'Cette carte est déjà assignée à un utilisateur.';
            
            // Extraire le message d'erreur spécifique si disponible
            if (error.error && typeof error.error === 'object') {
              if (error.error.message) {
                message = error.error.message;
              } else if (error.error.errors && error.error.errors.uid_carte) {
                message = error.error.errors.uid_carte[0];
              }
            }
            
            Swal.fire({
              icon: 'warning',
              title: 'Carte déjà assignée',
              text: message,
            });
          } else {
            // Afficher des informations détaillées pour le débogage pour les autres erreurs
            let errorDetails = '';
            if (error.error instanceof ErrorEvent) {
              // Erreur côté client
              errorDetails = `Erreur: ${error.error.message}`;
            } else {
              // Erreur côté serveur
              errorDetails = `Code: ${error.status}, Message: ${error.message}`;
              if (error.error && error.error.message) {
                errorDetails += `, Détails: ${error.error.message}`;
              }
            }
            
            this.errorMessage = "Erreur lors de l'assignation de la carte: " + errorDetails;
            
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: this.errorMessage,
            });
          }
        }
      });
  }

  // Fermer le modal
  closeModal() {
    // Fermer la connexion WebSocket si elle est active
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      console.log("🔴 Connexion WebSocket fermée.");
    }
    
    this.close.emit();
  }

  // Gérer la déconnexion lors de la destruction du composant
  ngOnDestroy() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      console.log("🔴 Connexion WebSocket fermée (destruction du composant).");
    }
  }
}