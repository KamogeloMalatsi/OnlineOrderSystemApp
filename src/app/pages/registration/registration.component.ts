import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { RegisterViewModel } from '../../models/UserModel';
import { RegistrationData } from '../../models/UserModel';

import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  model: RegisterViewModel = {
    username: '',
    userSurname: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.model.email !== this.model.confirmEmail) {
      this.errorMessage = 'Email and confirmation email do not match.';
      return;
    }
    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = 'Password and confirmation password do not match.';
      return;
    }

    const registrationData: RegistrationData = {
      username: this.model.username,
      userSurname: this.model.userSurname,
      email: this.model.email,
      password: this.model.password,
      phoneNumber: this.model.phoneNumber
    };

    this.authService.register(registrationData).subscribe(
      () => {
        this.router.navigate(['/login']); // Navigate to the login page after successful registration
      },
      (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}