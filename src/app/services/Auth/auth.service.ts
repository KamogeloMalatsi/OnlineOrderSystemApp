import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginViewModel } from '../../models/UserModel';
import { RegistrationData } from '../../models/UserModel';
import { tap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  register(data: RegistrationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegisterClient`, data);
  }

  login(model: LoginViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, model).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.token);
      })
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
}

