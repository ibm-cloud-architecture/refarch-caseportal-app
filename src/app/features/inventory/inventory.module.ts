import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryComponent } from './inventory.component';
import { ItemDetailComponent } from './item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [InventoryComponent,
      ItemDetailComponent],
  exports: [InventoryComponent,
    ItemDetailComponent]
})
export class InventoryModule { }
