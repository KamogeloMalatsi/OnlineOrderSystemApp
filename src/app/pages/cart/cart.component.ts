import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/Cart/cart.service';
import { AuthService } from '../../services/Auth/auth.service';
import { CartItem } from '../../models/CartItem';
import { ClientService } from '../../services/Client/client.service';
import { OrderService } from '../../services/Order/order.service';
import { OrderViewModel } from '../../models/Order';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private clientService: ClientService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
      this.cartService.updateCartItemCount(items.length);
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      quantity = 1;
    }
    item.quantity = quantity;
    this.cartService.updateCartItem(item).subscribe(() => {
      this.calculateTotal();
    });
  }

  removeItem(item: CartItem): void {
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      this.cartService.removeItemFromCart(item.cartItemId!).subscribe(() => {
        this.loadCartItems();
        window.alert('Item removed successfully.');
      });
    }
  }

  clearCart(): void {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart().subscribe(() => {
        this.cartItems = [];
        this.totalAmount = 0;
        this.cartService.updateCartItemCount(0);
        window.alert('Cart cleared successfully.');
      });
    }
  }

  clearCartAfterOrder(): void {
      this.cartService.clearCart().subscribe(() => {
        this.cartItems = [];
        this.totalAmount = 0;
        this.cartService.updateCartItemCount(0);

      });
  }

  placeOrder(): void {
    if (!window.confirm('Are you sure you want to place this order?')) {
      return; 
    }

    const email = this.authService.getClientInfo()?.email;
    if (email) {
      this.clientService.getClientByEmail(email).subscribe(client => {
        const currentOrder: OrderViewModel = {
          clientId: client.id,
          totalAmount: this.totalAmount,
          orderItems: this.cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        };

        this.orderService.placeOrder(currentOrder).subscribe(
          () => {
            window.alert('Order placed successfully.');
            this.clearCartAfterOrder();
            this.router.navigate(['/order']); 
          },
          error => window.alert('Failed to place order. Please try again.')
        );
      });
    } else {
      window.alert('Please log in to place an order.');
    }
  }
}
