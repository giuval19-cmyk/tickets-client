import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.api.iam}`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/login`,
      {
        username: email,
        password: password
      }
    ).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getRoles(): string[] {
    const decoded = this.decodeToken();

    const roles = decoded?.roles || decoded?.authorities || [];
    // rimuove prefix ROLE_
    return roles.map((r: string) => r.replace('ROLE_', ''));
  }


  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

}