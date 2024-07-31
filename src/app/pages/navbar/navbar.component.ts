import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service'; 
import { CartService } from '../../services/Cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  username: string | null = '';
  cartItemCount: number = 0;
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    const decodedToken = this.authService.getDecodedToken();
    this.username = decodedToken ? decodedToken.sub : null; 
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.username = null;
    this.router.navigate(['/login']);
  }
}