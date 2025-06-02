import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      // Ако нема токен, пренасочи на login
      this.router.navigate(['/auth']);
      return false;
    }

    try {
      // Декодирај го токенот
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role === 'Admin') {
        return true;
      } else {
        // Ако е Client или некориснички token, пренасочи на Home
        this.router.navigate(['/home']);
        return false;
      }
    } catch (e) {
      // Ако токенот е невалиден
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
