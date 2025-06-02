// src/app/login-register/login-register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  isLogin: boolean = true;
  loginData = { email: '', password: '' };
  registerData = { firstName: '', lastName: '', username: '', email: '', password: '' };
  showReset: boolean = false;
  resetData = { email: '' };
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  toggleMode(): void {
    this.isLogin = !this.isLogin;
  }

  onSubmit(): void {
    if (this.isLogin) {
      this.userService.loginUser(this.loginData.email, this.loginData.password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
        // Обработка на различни грешки од бекенд
        if (err.status === 404) {
          this.errorMessage = 'Корисникот не е пронајден. Ве молиме регистрирајте се.';
        } else if (err.status === 403) {
          this.errorMessage = 'Овој корисник е баниран.';
        } else if (err.status === 401) {
          this.errorMessage = 'Невалидна е-пошта или лозинка.';
        } else {
          this.errorMessage = 'Се појави грешка. Ве молиме обидете се повторно.';
        }
      }
      });
    } else {
      const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!strongPassword.test(this.registerData.password)) {
        alert('Лозинката мора да има најмалку 8 карактери, вклучувајќи најмалку една буква и еден број.');
        return;
      }
      this.userService
        .registerUser(
          this.registerData.firstName,
          this.registerData.lastName,
          this.registerData.username,
          this.registerData.email,
          this.registerData.password
        )
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          },
          error: (err) => console.error(err)
        });
    }
  }

  toggleReset(): void {
    this.showReset = !this.showReset;
  }

  onResetPassword(): void {
    const newPass = 'НоваЛозинка123'; 
    this.userService.resetPassword(this.resetData.email, newPass).subscribe({
      next: () => alert('Лозинка е успешно ресетирана.'),
      error: (err) => console.error(err)
    });
  }
}