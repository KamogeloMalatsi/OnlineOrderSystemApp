import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/CartItem';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://localhost:7020/api/Cart';
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCartItemCount();

    // Subscribe to the login event
    this.authService.userLoggedIn$.subscribe(() => {
      this.loadCartItemCount();
    });
  }

  getCartItems(): Observable<CartItem[]> {
    const clientEmail = this.authService.getClientEmail();
    if (clientEmail) {
      return this.http.get<CartItem[]>(`${this.apiUrl}/GetCartItems/${clientEmail}`);
    }
    return new Observable<CartItem[]>(); // Return an empty observable if no email
  }

  addItemToCart(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/AddItemToCart`, cartItem);
  }

  updateCartItem(cartItem: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/UpdateCartItem/${cartItem.cartItemId}`, cartItem);
  }

  removeItemFromCart(cartItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveCartItem/${cartItemId}`);
  }

  clearCart(): Observable<void> {
    const clientEmail = this.authService.getClientEmail();
    if (clientEmail) {
      return this.http.delete<void>(`${this.apiUrl}/ClearCart/${clientEmail}`);
    }
    return new Observable<void>(); // Return an empty observable if no email
  }

  loadCartItemCount(): void {
    this.getCartItems().subscribe(items => {
      this.cartItemCount.next(items.length);
    });
  }

  updateCartItemCount(count: number): void {
    this.cartItemCount.next(count);
  }
}
