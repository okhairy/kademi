import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getNombreEtudiants(): Observable<{ nombre_etudiants: number }> {
    const url = `${this.baseUrl}/etudiants/nombre`;
    return this.http.get<{ nombre_etudiants: number }>(url);
  }

  checkAccesCampus(uidCarte: string): Observable<any> {
    const url = `${this.baseUrl}/etudiant/acces-campus`;
    return this.http.post<any>(url, { uid_carte: uidCarte });
  }
  
}
