import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* declare global {
  interface Navigator {
    serial?: any;
  }
} */

@Component({
  selector: 'app-scan-carte-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scan-carte-modal.component.html',
  styleUrls: ['./scan-carte-modal.component.css']
})
export class ScanCarteModalComponent {
  @Input() studentId!: number; // ID de l'étudiant pour l'assignation de la carte
  @Output() close = new EventEmitter<void>();
  @Input() user: any; // L'utilisateur sélectionné


  cardUid: string = ''; // UID de la carte RFID
  isCardScanned: boolean = false; // État de la carte scannée

  constructor(private http: HttpClient) {}

/*   async openSerialPort() {
    if (!navigator.serial) {
      console.error("Web Serial API non supportée par ce navigateur.");
      alert("Votre navigateur ne prend pas en charge la connexion aux ports série.");
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        this.cardUid = decoder.decode(value).trim();
        this.isCardScanned = true;

        reader.releaseLock();
        break; // On arrête la lecture après avoir reçu un UID valide
      }
    } catch (error) {
      console.error("Erreur de connexion au port série :", error);
      alert("Impossible d'accéder au lecteur de carte. Vérifiez la connexion.");
    }
  }
 */
  assignerCarte() {
    if (!this.cardUid) {
      alert("Veuillez scanner une carte.");
      return;
    }

    this.http.post(`http://127.0.0.1:8000/api/etudiants/${this.studentId}/assigner-carte`, {
      uid_carte: this.cardUid
    }).subscribe({
      next: (response) => {
        console.log("Carte assignée :", response);
        this.isCardScanned = true;
        alert("Carte assignée avec succès !");
      },
      error: (error) => {
        console.error("Erreur lors de l'assignation :", error);
        alert("Erreur lors de l'assignation de la carte.");
      }
    });
  }

  closeModal() {
    this.close.emit(); // Fermer le modal
  }
}
