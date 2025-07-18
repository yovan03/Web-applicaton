import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { AdminGuard } from './guards/admin.guard';
import { AddDataComponent } from './add-data/add-data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  // Ако е празен пат, пренасочи на login/register
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Login/Register
  { path: 'auth', component: LoginRegisterComponent },

  // Почетна и за ненајавени
  { path: 'home', component: HomeComponent },

  //Акаунт – само за најавени корисници
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },

  // Admin-only: Упрaвување со корисници
  {path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard]},

  // Admin-only: Додај нов културен објект
  {path: 'admin/add-data', component: AddDataComponent, canActivate: [AuthGuard, AdminGuard]
  },

  // Admin-only: Уреди постоечки со ID
  { path: 'admin/add-data/:id', component: AddDataComponent, canActivate: [AuthGuard, AdminGuard]
  },

  { path: 'about', component: AboutComponent },

  // Сите останати невалидни рути – пренасочи на home
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
