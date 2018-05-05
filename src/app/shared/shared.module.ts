import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InputComponent } from './input/input.component';
import { TileComponent } from './tile/tile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ HeaderComponent,
    FooterComponent,
    InputComponent,
    TileComponent ],
  exports: [ FooterComponent,
   HeaderComponent,
   InputComponent,
   TileComponent ]
})
export class SharedModule { }
