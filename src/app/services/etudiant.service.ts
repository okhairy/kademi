import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiUrl = 'http://127.0.0.1:8000/api/etudiants/nombre'; // Nouvelle URL

  constructor(private http: HttpClient) {}

  getNombreEtudiants(): Observable<{ nombre_etudiants: number }> {
    return this.http.get<{ nombre_etudiants: number }>(this.apiUrl);
  }
  
}
