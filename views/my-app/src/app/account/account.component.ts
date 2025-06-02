import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: any;
  oldPassword = '';
  newPassword = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((res) => (this.user = res));
  }

  changePassword(): void {
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPassword.test(this.newPassword)) {
    alert('Лозинката мора да има најмалку 8 карактери, вклучувајќи најмалку една буква и еден број.');
    return;
    }
  
    this.userService.updatePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => alert('Лозинката е променета.'),
      error: (err) => console.error(err)
    });
  }

  onDeleteAccount(): void {
    if (confirm('Дали сте сигурни дека сакате да го избришете акаунтот?')) {
      this.userService.deleteAccount(this.user._id).subscribe(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      });
    }
  }
}
