import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { LoginGuard } from '../login/login.guard';

export const routes: Routes = [
    // {  path: 'home', component: HomeComponent, canActivate: [LoginGuard]},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent},
    { path: 'inventory', component: InventoryComponent,canActivate: [LoginGuard]},
    /*
    { path: 'advisor', component: AdvisorComponent,canActivate: [LoginGuard]},
    { path: 'itSupport', component: ConversationComponent,canActivate: [LoginGuard]},
    */
    { path: '**', redirectTo: '/home', pathMatch: 'full'}
];
