// src/app/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  searchTerm = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => (this.users = res),
      error: (err) => console.error('Грешка при вчитување корисници', err)
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadUsers();
    } else {
      this.userService.searchUsers(this.searchTerm).subscribe({
        next: (res) => (this.users = res),
        error: (err) => console.error('Грешка при пребарување', err)
      });
    }
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'Admin' ? 'Client' : 'Admin';
    this.userService.updateUserRole(user._id, newRole).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Грешка при ажурирање улога', err)
    });
  }

  toggleBan(user: any): void {
    this.userService.banUser(user._id, !user.isBanned).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Грешка при банирање', err)
    });
  }
}
