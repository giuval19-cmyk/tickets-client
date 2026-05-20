import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const redirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) {
    return router.createUrlTree(['/home']);
  } else {
    return router.createUrlTree(['/login']);
  }
};