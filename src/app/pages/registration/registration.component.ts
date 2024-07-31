import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      userSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    }, { validator: this.checkEmailsAndPasswords });
  }

  checkEmailsAndPasswords(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (email !== confirmEmail) {
      return { emailMismatch: true };
    }
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  register(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }

    const formValues = this.registrationForm.value;
    const registrationData = {
      username: formValues.username,
      userSurname: formValues.userSurname,
      email: formValues.email,
      password: formValues.password,
      phoneNumber: formValues.phoneNumber
    };

    this.authService.register(registrationData).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
