// src/app/services/search.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, this.getHeaders());
  }

  searchByKeyword(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filter/keyword?keyword=${keyword}`, this.getHeaders());
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  updateHeritage(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getHeaders()); 
  }

  createHeritage(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getHeaders());
  }

  deleteHeritage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

}
