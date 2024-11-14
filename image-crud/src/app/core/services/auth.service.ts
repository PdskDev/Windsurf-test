import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'YOUR_API_URL'; // Replace with your API URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
}
