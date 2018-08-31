import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatDialogModule, MatCardModule } from '@angular/material';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InputComponent } from './input/input.component';
import { TileComponent } from './tile/tile.component';
import { TilecardComponent } from './tilecard/tilecard.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule
  ],
  entryComponents: [ ModalDialogComponent, TilecardComponent],
  declarations: [ HeaderComponent,
    FooterComponent,
    InputComponent,
    TileComponent,
    TilecardComponent,
    ModalDialogComponent ],
  exports: [ FooterComponent,
   HeaderComponent,
   InputComponent,
   TilecardComponent,
   TileComponent ]
})
export class SharedModule { }
