import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import * as L from 'leaflet';
import { UserService } from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-heritage-details',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './heritage-details.component.html',
  styleUrls: ['./heritage-details.component.css']
})
export class HeritageDetailsComponent implements OnInit {
  heritage: any = null;
  userLists: { wishlist: any[], visited: any[] } = { wishlist: [], visited: [] };

  constructor(
    private searchService: SearchService, 
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.searchService.getById(id).subscribe({
        next: (res) => {
          this.heritage = res;
          console.log('Heritage data:', this.heritage);
          this.loadUserLists();
        },
        error: (err) => alert('Грешка при вчитување на објектот: ' + err.error.message)
      });
    }
  }
  
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called, checking map container:', document.getElementById('map'));
    if (this.heritage) {
      this.initMap();
    } else {
      console.warn('Heritage data not loaded yet in ngAfterViewInit');
      // НОВО: Чекај heritage да се вчита
      const checkHeritage = setInterval(() => {
        if (this.heritage) {
          this.initMap();
          clearInterval(checkHeritage);
        }
      }, 100);
    }
  }
 private initMap(): void {
    console.log('initMap called, heritage:', this.heritage);
    if (this.heritage?.latitude && this.heritage?.longitude) {
      const map = L.map('map').setView([this.heritage.latitude, this.heritage.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
      L.marker([this.heritage.latitude, this.heritage.longitude])
        .addTo(map)
        .bindPopup(this.heritage.name)
        .openPopup();
    } else {
      console.warn('No latitude or longitude available');
    }
  }

  get isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role === 'Admin';
    } catch {
      return false;
    }
  }

  //проверка за клиент улога
  get isClient(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role === 'Client';
    } catch {
      return false;
    }
  }

  //метода за уредување на објект
  editItem(item: any): void {
    if (!this.isAdmin) {
      alert('Само администратори можат да уредуваат објекти.');
      return;
    }
    this.router.navigate(['/admin/add-data', item._id]);
  }

  //метода за бришење на објект
  deleteItem(id: string): void {
    if (!this.isAdmin) {
      alert('Само администратори можат да бришат објекти.');
      return;
    }
    if (confirm('Дали сте сигурни дека сакате да го избришете објектот?')) {
      this.searchService.deleteHeritage(id).subscribe({
        next: () => {
          alert('Објектот е успешно избришан.');
          this.router.navigate(['/']); // Навигирај назад кон почетна
        },
        error: (err) => alert('Грешка при бришење: ' + err.error.message)
      });
    }
  }

  //метода за додавање во Места за посетување
  addToWishlist(heritageId: string): void {
    this.userService.addToWishlist(heritageId).subscribe({
      next: () => {
        alert('Објектот е додаден во Места за посетување.');
        this.loadUserLists();
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  //метода за додавање во Посетени места
  addToVisited(heritageId: string): void {
    this.userService.addToVisited(heritageId).subscribe({
      next: () => {
        alert('Објектот е додаден во Посетени места.');
        this.loadUserLists();
      },
      error: (err) => alert('Грешка: ' + err.error.message)
    });
  }

  //метода за проверка дали е во Места за посетување
  isInWishlist(heritageId: string): boolean {
    return this.userLists.wishlist.some(item => item._id === heritageId);
  }

  //метода за проверка дали е во Посетени места
  isInVisited(heritageId: string): boolean {
    return this.userLists.visited.some(item => item._id === heritageId);
  }

  //метода за вчитување на листите
  private loadUserLists(): void {
    this.userService.getUserLists().subscribe({
      next: (res) => {
        this.userLists = res;
      },
      error: (err) => console.error('Грешка при вчитување на листите', err)
    });
  }
}