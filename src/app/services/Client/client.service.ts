import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://localhost:7020/api/Authentication'; 
  
  constructor(private http: HttpClient) {}

  getClientByEmail(email: string): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.apiUrl}/GetClientByEmail/${email}`);
  }
}

export interface ClientDto {
  id: string;
  userName: string;
  email: string;
  userSurname: string;
  createdDate: Date;
  updatedDate: Date | null;
}
