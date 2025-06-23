// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { SearchService } from '../services/search.service';
import { UserService } from '../services/user.service';

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
  userLists: { wishlist: any[], visited: any[] } = 
  { wishlist: [], visited: [] }; //чување на листите
  currentPage = 1;
  itemsPerPage = 21;
  totalItems = 0;

  constructor(
    private searchService: SearchService, 
    private router: Router, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.loadUserLists();
  }

  get paginatedResults(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.results.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo(0, 0);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 0);
    }
  }

  getAll(): void {
    this.searchService.getAll().subscribe(res => {
      this.results = res;
      this.totalItems = res.length; 
      this.currentPage = 1; 
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.getAll();
    } else {
      this.searchService.searchByKeyword(this.searchTerm).subscribe(res => {
        this.results = res;
        this.totalItems = res.length;
        this.currentPage = 1; 
      });
    }
  }

  loadUserLists(): void {
    this.userService.getUserLists().subscribe({
      next: (res) => {
        this.userLists = res;
      },
      error: (err) => console.error('Грешка при вчитување на листите', err)
    });
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

  get isClient(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token as string);
      return decoded.role === 'Client';
    } catch {
      return false;
    }
  }


  editItem(item: any): void {
    //додадено!!!!
    if (!this.isAdmin) {
      alert('Само администратори можат да уредуваат објекти.');
      return;
    } 
    this.router.navigate(['/admin/add-data', item._id]);
  }

  deleteItem(id: string): void {
    //!!!!
    if (!this.isAdmin) {
      alert('Само администратори можат да бришат објекти.');
      return;
    }
    if (confirm('Дали сте сигурни дека сакате да го избришете објектот?')) {
      this.searchService.deleteHeritage(id).subscribe(() => this.getAll());
    }
  }

  //метода за додавање во Места за посетување
  addToWishlist(heritageId: string): void {
    this.userService.addToWishlist(heritageId).subscribe({
      next: () => {
        alert('Објектот е додаден во Места за посетување.');
        this.loadUserLists(); // Освежи ги листите
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  //метода за додавање во Посетени места
  addToVisited(heritageId: string): void {
    this.userService.addToVisited(heritageId).subscribe({
      next: () => {
        alert('Објектот е додаден во Посетени места.');
        this.loadUserLists(); // Освежи ги листите
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  //метода за проверка дали објектот е во Места за посетување
  isInWishlist(heritageId: string): boolean {
    return this.userLists.wishlist.some(item => item._id === heritageId);
  }

  //метода за проверка дали објектот е во Посетени места
  isInVisited(heritageId: string): boolean {
    return this.userLists.visited.some(item => item._id === heritageId);
  }
}
