import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule,
         MatDialogModule,
         MatTabsModule,
         MatIconModule,
         MatProgressSpinnerModule,
         MatCardModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryService } from './inventory/inventory.service';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationService } from './conversation/conversation.service';
import { TelcoDemoModule } from './telcodemo/telcodemo.module';
import { TelcoDemoService } from './telcodemo/telcodemo.service';
import { LoginGuard } from './login/login.guard';
import { LoginService } from './login/login.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  declarations: [HomeComponent,LoginComponent],
  exports: [HomeComponent, LoginComponent, InventoryModule, ConversationModule, TelcoDemoModule],
  providers: [  InventoryService, ConversationService, TelcoDemoService, LoginGuard, LoginService ]
})
export class FeaturesModule { }
