import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();

  let request = req;

  //aggiungi token se presente
  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //intercetta risposta
  return next(request).pipe(

    catchError((error) => {

      if (error.status === 401 && !req.url.includes('/login')) {
        console.warn('Token scaduto o non valido → logout');

        auth.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })

  );
};