import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    CommonModule,
    LoginModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent, LoginModule]
})
export class FeaturesModule { }
