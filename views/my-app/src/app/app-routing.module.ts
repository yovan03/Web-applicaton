import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AccountComponent } from './account/account.component';
import { AdminGuard } from './guards/admin.guard';
import { AddDataComponent } from './add-data/add-data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

const routes: Routes = [
  // Ако е празен пат, пренасочи на login/register
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  // Login/Register
  { path: 'auth', component: LoginRegisterComponent },

  // Почетна и Акаунт – само за најавени корисници
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },


  // Admin-only:
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/add-data',
    component: AddDataComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'admin/add-data/:id',
    component: AddDataComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  // Сите останати невалидни рути – пренасочи на home ако е најавен, или на login ако не е
  { path: '**', redirectTo: '/auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
