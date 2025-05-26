import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // ou "utilisateur", selon ce que tu stockes

  if (token) {
    return true; // Autoriser l'accès
  } else {
    return router.parseUrl('/login'); // Rediriger vers /login
  }
};
