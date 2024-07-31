import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem, OrderViewModel, OrderDto } from '../../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7020/api/Order';

  constructor(private http: HttpClient) { }

  placeOrder(order: OrderViewModel): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.apiUrl}/PlaceOrder`, order);
  }

  getClientOrders(clientEmail: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/GetClientOrders/${clientEmail}`);
  }

  getOrderById(orderId: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/GetOrderById/${orderId}`);
  }

  getOrderStatusUpdates(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetOrderStatusUpdates/${orderId}`);
  }
}

