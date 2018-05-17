import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TelcoHomeComponent } from './telcohome.component';
import { TelcoChatComponent } from './telcochat/telcochat.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [TelcoHomeComponent, TelcoChatComponent],
  exports: [TelcoHomeComponent, TelcoChatComponent]
})
export class TelcoDemoModule { }
