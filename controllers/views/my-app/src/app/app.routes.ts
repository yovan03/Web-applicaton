// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AddDataComponent } from './add-data/add-data.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { ListsComponent } from './lists/lists.component';
import { HeritageDetailsComponent } from './heritage-details/heritage-details.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', component: LoginRegisterComponent },
  { path: 'home', component: HomeComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'lists', component: ListsComponent, canActivate: [AuthGuard] },
  { path: 'heritage/:id', component: HeritageDetailsComponent },
  { path: 'about', component: AboutComponent },
  
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
  { path: '**', redirectTo: 'home' }
];
