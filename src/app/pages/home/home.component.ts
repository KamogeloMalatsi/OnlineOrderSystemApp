import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/Product/product.service';
import { CartService } from '../../services/Cart/cart.service';
import { AuthService } from '../../services/Auth/auth.service';
import { ClientService, ClientDto } from '../../services/Client/client.service';
import { Product } from '../../models/Product';
import { CartItem } from '../../models/CartItem';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
  }

  addToCart(product: Product): void {
    const email = this.authService.getClientEmail();
    if (email) {
      this.clientService.getClientByEmail(email).subscribe((client: ClientDto) => {
        const cartItem: CartItem = {
          productId: product.productId,
          clientId: client.id, 
          quantity: 1,
          unitPrice: product.price,
          productName: product.name,
          productDescription: product.description,
        };

        this.cartService.addItemToCart(cartItem).subscribe(() => {
          this.cartService.loadCartItemCount();
        });
      });
    } else {
      console.log('Please log in to add items to the cart.');
    }
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.products = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadProducts();
    }
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.loadProducts(); 
  }
  

}
