// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AddDataComponent } from './add-data/add-data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: LoginRegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },

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
  { path: '**', redirectTo: 'auth' }
];
