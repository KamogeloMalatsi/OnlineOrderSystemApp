// login-view.model.ts
export interface LoginViewModel {
    email: string;
    password: string;
  }
  
// register-view.model.ts
export interface RegisterViewModel {
  username: string;
  userSurname: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

// registration-data.model.ts
export interface RegistrationData {
  username: string;
  userSurname: string;
  email: string;
  password: string;
  phoneNumber: string;
}

  