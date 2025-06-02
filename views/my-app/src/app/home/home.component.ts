// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchTerm = '';
  results: any[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.searchService.getAll().subscribe(res => (this.results = res));
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.getAll();
    } else {
      this.searchService.searchByKeyword(this.searchTerm).subscribe(res => (this.results = res));
    }
  }

  get isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token as string);
      return decoded.role === 'Admin';
    } catch {
      return false;
    }
  }

  editItem(item: any): void {
    this.router.navigate(['/admin/add-data', item._id]);
  }

  deleteItem(id: string): void {
    if (confirm('Дали сте сигурни дека сакате да го избришете објектот?')) {
      this.searchService.deleteHeritage(id).subscribe(() => this.getAll());
    }
  }
}
