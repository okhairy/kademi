import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api' // URL de base générale
  });

  constructor() { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return from(this.axiosInstance.post('/login', credentials).then(response => {
      // Stocker le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    }));
  }

  forgotPassword(email: string): Observable<any> {
    return from(this.axiosInstance.post('/password/forgot', { email }));
  }

  resetPassword(data: { token: string, password: string, password_confirmation: string }): Observable<any> {
    return from(this.axiosInstance.post('/password/reset', data));
  }  
   
  logout(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })).pipe(
        finalize(() => {
          // Supprimer le token du localStorage après la déconnexion
          localStorage.removeItem('token');
        })
      );
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }
  
  getUserConnected(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getLastDepotEtDepenses(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/last-depot', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getTransactions(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log("Token récupéré :", token);

    if (token) {
      return from(this.axiosInstance.get('/testest', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  makeDepot(etudiantId: number, data: { montant: number, operateur: string }): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.post(`/etudiant/depot/${etudiantId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getWeekDepenses(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/etudiant/week-depenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getMonthDepenses(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/etudiantc/month-depenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getMeals(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/depenses-mensuelles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }

  getdailyMeals(): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.get('/depenses-journee', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
    });
      }
    }

    getDepots(): Observable<any> {
      const token = localStorage.getItem('token');
  
        if (token) {
          return from(this.axiosInstance.get('/mes-depot', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        }));
      } else {
        return new Observable(observer => {
          observer.error(new Error('No token found'));
        });
      }
    }

    getusers(): Observable<any> {
      const token = localStorage.getItem('token');
  
      if (token) {
        return from(this.axiosInstance.get('/nbr-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }}));
        } else {
          return new Observable(observer => {
            observer.error(new Error('No token found'));
          });
        
    }
  }

  depot(etudiantId: number, data: { montant: number, operateur: string }): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      return from(this.axiosInstance.post(`/etudiant/depot/${etudiantId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }));
    } else {
      return new Observable(observer => {
        observer.error(new Error('No token found'));
      });
    }
  }
}
