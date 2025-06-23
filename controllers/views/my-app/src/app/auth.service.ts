import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  role?: string; 
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiURL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.apiURL}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiURL}/register`, data);
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    console.log('Токен во getUserRole:', token ? 'Постој токен' : 'Нема токен');
    if (!token) {
      console.log('Нема токен во localStorage');
      return null;
    }
    try {
      const decoded: TokenPayload = jwtDecode(token);
      return decoded.role || null;
    } catch (e) {
      console.error('Грешка при декодирање на токен:', e);
      return null;
    }
  }

  isAdmin(): boolean {
    const isAdmin = this.getUserRole() === 'Admin';
    console.log('isAdmin:', isAdmin);
    return isAdmin;
  }
  
  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
  const decoded = this.getDecodedToken();
  if (!decoded) return false;
  if (decoded.exp * 1000 < Date.now()) return false; // Token expired
  return true;
}

private getDecodedToken(): TokenPayload | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
}

}