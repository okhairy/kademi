import { Injectable } from '@angular/core';

import axios from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api' // URL de base générale
  });

  constructor() { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return from(this.axiosInstance.post('/login', credentials));
  }
   
}
