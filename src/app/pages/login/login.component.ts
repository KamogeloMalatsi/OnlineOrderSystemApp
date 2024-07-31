import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { LoginViewModel } from '../../models/UserModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  model: LoginViewModel = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    );
  }
}
