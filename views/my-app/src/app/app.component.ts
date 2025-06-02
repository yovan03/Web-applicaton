import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../app/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar = true;
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Скриј го хедерот на /auth
        this.showNavbar = event.urlAfterRedirects !== '/auth';
        this.checkAdminStatus();
      }
    });
    
    this.checkAdminStatus();
    // Слушај за промени во localStorage (најава/одјава)
    window.addEventListener('storage', () => {
      this.checkAdminStatus();
    });

  }
  private checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
    console.log('isAdmin во checkAdminStatus:', this.isAdmin);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAdmin = false;
    this.router.navigate(['/auth']);
    
  }
}
