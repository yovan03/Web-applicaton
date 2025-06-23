import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  userLists: { wishlist: any[], visited: any[] } = { wishlist: [], visited: [] };
  originalLists: { wishlist: any[], visited: any[] } = { wishlist: [], visited: [] }; //Чувај оригинални листи
  searchTerm = '';
  
  constructor(
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadUserLists();
  }

  getAll(): void {
    this.userLists = { ...this.originalLists };
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.getAll(); 
    } else {
      this.searchService.searchByKeyword(this.searchTerm).subscribe({
        next: (res) => {
          // Филтрирање резултати за да се совпаѓаат со wishlist и visited
          const searchIds = res.map((item: any) => item._id);
          this.userLists = {
            wishlist: this.originalLists.wishlist.filter(item => searchIds.includes(item._id)),
            visited: this.originalLists.visited.filter(item => searchIds.includes(item._id))
          };
        },
        error: (err) => {
          alert('Грешка при пребарување: ' + err.error.message);
          console.error('Error:', err);
        }
      });
    }
  }

  // Вчитување на листите на корисникот
  loadUserLists(): void {
    this.userService.getUserLists().subscribe({
      next: (res) => {
        this.originalLists = { ...res };
        this.userLists = res;
      },
      error: (err) => alert('Грешка при вчитување на листите: ' + err.error.message)
    });
  }

  // Преместување од Места за посетување во Посетени места
  moveToVisited(heritageId: string): void {
    this.userService.moveToVisited(heritageId).subscribe({
      next: () => {
        alert('Објектот е преместен во Посетени места.');
        this.loadUserLists();
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  // Преместување од Посетени места во Места за посетување
  moveToWishlist(heritageId: string): void {
    this.userService.moveToWishlist(heritageId).subscribe({
      next: () => {
        alert('Објектот е преместен во Места за посетување.');
        this.loadUserLists();
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  // Отстранување од Места за посетување
  removeFromWishlist(heritageId: string): void {
    if (confirm('Дали сте сигурни дека сакате да го отстраните објектот од Места за посетување?')) {
      this.userService.removeFromWishlist(heritageId).subscribe({
        next: () => {
          alert('Објектот е отстранет од Места за посетување.');
          this.loadUserLists();
        },
        error: (err) => alert('Грешка: ' + err.error.message)
      });
    }
  }

  // Отстранување од Посетени места
  removeFromVisited(heritageId: string): void {
    if (confirm('Дали сте сигурни дека сакате да го отстраните објектот од Посетени места?')) {
      this.userService.removeFromVisited(heritageId).subscribe({
        next: () => {
          alert('Објектот е отстранет од Посетени места.');
          this.loadUserLists();
        },
        error: (err) => alert('Грешка: ' + err.error.message)
      });
    }
  }
}