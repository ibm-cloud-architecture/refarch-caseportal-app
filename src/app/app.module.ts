import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RoutingModule } from './features/routing/routing.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';
import { LoginGuard } from './features/login/login.guard';
import { LoginService } from './features/login/login.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    SharedModule,
    FeaturesModule
  ],
  providers: [LoginGuard, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
