import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { LoginGuard } from '../login/login.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [LoginGuard]},
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '/home', pathMatch: 'full'}
];
