import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<{ users: any[] }>(`${this.apiUrl}/users`).pipe(
      map(response => response.users || [])
    );
  }

  ajouterUtilisateur(register: any) {
    return this.http.post(`${this.apiUrl}/utilisateurs/register`, register);
  }
  //methode pour recuperer tous les utilisateurs
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
   // Récupérer un utilisateur spécifique par ID
  getUtilisateur(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/utilisateurs/${id}`);
  }

  // Modifier un utilisateur existant
  modifierUtilisateur(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/utilisateurs/${id}`, data);
  }
   // Méthode pour bloquer un utilisateur
   bloquerUtilisateur(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bloquer/${id}`, {});
  }
  supprimerUtilisateur(id: number, role: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/utilisateur/${id}/${role}`);
  }
    // Méthode pour supprimer plusieurs utilisateurs
    supprimerPlusieursUtilisateurs(role: string, ids: number[]): Observable<any> {
      return this.http.delete(`${this.apiUrl}/supprimer-utilisateurs/${role}`, { body: { ids } });
    }
    //methode pour recuperr les transactions de l'etudiant
    getTransactions(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/transactions`).pipe(
        map(response => {
          console.log("Transactions reçues :", response);
          return Array.isArray(response) ? response : [];
        })
      );
    }
    // ✅ Assigner une carte à un étudiant (PUT)
  assignerCarte(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/etudiants/${id}/assigner-carte`, {});
  }

  // ✅ Désassigner une carte d’un étudiant (DELETE)
  desassignerCarte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/etudiants/${id}/desassigner-carte`);
  }

    
}
