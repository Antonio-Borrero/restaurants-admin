import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private email = signal(localStorage.getItem('email'));
  userEmail = this.email.asReadonly();

  login(email: string, password: string) {
    return this.http
      .post<{
        token: string;
      }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((resp) => {
          this.email.set(email);
          localStorage.setItem('email', email);
          localStorage.setItem('token', resp.token);
        }),
      );
  }

  logout() {
    this.email.set(null);
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return this.getToken() !== null;
  }
}
