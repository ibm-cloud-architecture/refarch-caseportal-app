import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ HeaderComponent,
    FooterComponent,
    InputComponent ],
  exports: [ FooterComponent,
   HeaderComponent,
   InputComponent ]
})
export class SharedModule { }
