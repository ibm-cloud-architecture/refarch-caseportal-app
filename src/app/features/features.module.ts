import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';
import { HomeService } from './home/home.service';
import { SharedModule } from '../shared/shared.module';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    HttpModule,
    SharedModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent, LoginModule],
  providers: [ HomeService ]
})
export class FeaturesModule { }
