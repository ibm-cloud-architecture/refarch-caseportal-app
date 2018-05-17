import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryModule } from './inventory/inventory.module';
import { HomeService } from './home/home.service';
import { InventoryService } from './inventory/inventory.service';
import { HttpModule } from '@angular/http';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationService } from './conversation/conversation.service';
import { TelcoDemoModule } from './telcodemo/telcodemo.module';
import { TelcoDemoService } from './telcodemo/telcodemo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    SharedModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent, LoginModule, InventoryModule, ConversationModule, TelcoDemoModule],
  providers: [ HomeService, InventoryService, ConversationService, TelcoDemoService ]
})
export class FeaturesModule { }
