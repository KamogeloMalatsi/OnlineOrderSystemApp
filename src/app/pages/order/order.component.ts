import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/Order/order.service';
import { AuthService } from '../../services/Auth/auth.service';
import { OrderDto, OrderStatusUpdateDto } from '../../models/Order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: OrderDto[] = [];
  selectedOrder: OrderDto | null = null;
  orderStatusUpdates: OrderStatusUpdateDto[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const email = this.authService.getClientInfo()?.email;
    if (email) {
      this.orderService.getClientOrders(email).subscribe(
        (orders: OrderDto[]) => this.orders = orders,
        error => window.alert('Failed to load orders. Please try again later.')
      );
    } else {
      window.alert('Please log in to view your orders.');
    }
  }

  viewOrderDetails(order: OrderDto): void {
    this.selectedOrder = order;
    this.loadOrderStatusUpdates(order.orderId);
  }

  loadOrderStatusUpdates(orderId: string): void {
    this.orderService.getOrderStatusUpdates(orderId).subscribe(
      (updates: OrderStatusUpdateDto[]) => this.orderStatusUpdates = updates,
      error => window.alert('Failed to load order status updates. Please try again later.')
    );
  }

}
