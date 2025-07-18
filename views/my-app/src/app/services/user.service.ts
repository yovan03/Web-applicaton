// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // 1) Метод за најава
  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // 2) Метод за регистрација
  registerUser(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      firstName,
      lastName,
      username,
      email,
      password
    });
  }

  // 3) Метод за reset на лозинка
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reset-password`, { email, newPassword });
  }

  // Постоечките методи за AuthGuard, AdminGuard, итн.
  getProfile(): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile`, this.getHeaders());
}

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, { oldPassword, newPassword }, this.getHeaders());
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, this.getHeaders());
  }

 //Mетоди за управување со Client-ти, само за Админ
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, this.getHeaders());
  }

  searchUsers(keyword: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`, this.getHeaders());
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/role/${userId}`, { role }, this.getHeaders());
  }

  banUser(userId: string, isBanned: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/ban/${userId}`, { isBanned }, this.getHeaders());
  }

  //Mетоди за управување со листите
  addToWishlist(heritageId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/wishlist`, { heritageId }, this.getHeaders());
  }

  addToVisited(heritageId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/visited`, { heritageId }, this.getHeaders());
  }

  getUserLists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lists`, this.getHeaders());
  }

  moveToVisited(heritageId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/move-to-visited`, { heritageId }, this.getHeaders());
  }

  moveToWishlist(heritageId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/move-to-wishlist`, { heritageId }, this.getHeaders());
  }

  removeFromWishlist(heritageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/wishlist/${heritageId}`, this.getHeaders());
  }

  removeFromVisited(heritageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/visited/${heritageId}`, this.getHeaders());
  }
}
