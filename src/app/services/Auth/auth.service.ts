import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginViewModel, RegistrationData } from '../../models/UserModel';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  sub: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7020/api/Authentication';
  private tokenKey = 'authToken';
  private userLoggedInSubject = new BehaviorSubject<void>(undefined);
  userLoggedIn$ = this.userLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: RegistrationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegisterClient`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  login(model: LoginViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, model, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((res: any) => {
        this.storeToken(res.token);
        this.notifyUserLoggedIn();
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  getClientInfo(): { email: string, username: string } | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? { email: decodedToken.email, username: decodedToken.sub } : null;
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Server error');
  }

  getClientEmail(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.email : null;
  }

  notifyUserLoggedIn(): void {
    this.userLoggedInSubject.next();
  }
}
