import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { ConversationComponent } from '../conversation/conversation.component';
import { LoginGuard } from '../login/login.guard';
import { TelcoHomeComponent } from '../telcodemo/telcohome.component';
import { TelcoChatComponent } from '../telcodemo/telcochat/telcochat.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [LoginGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'inventory', component: InventoryComponent,canActivate: [LoginGuard]},
    { path: 'telcohome', component: TelcoHomeComponent,canActivate: [LoginGuard]},
    { path: 'telcoChat', component: TelcoChatComponent,canActivate: [LoginGuard]},
    { path: 'itSupport', component: ConversationComponent,canActivate: [LoginGuard]},
    { path: '**', redirectTo: '/home', pathMatch: 'full'}
];
