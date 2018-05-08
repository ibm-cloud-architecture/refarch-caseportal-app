import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryModule } from './inventory/inventory.module';
import { HomeService } from './home/home.service';
import { InventoryService } from './inventory/inventory.service';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    HttpModule,
    SharedModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent, LoginModule, InventoryModule],
  providers: [ HomeService, InventoryService ]
})
export class FeaturesModule { }
