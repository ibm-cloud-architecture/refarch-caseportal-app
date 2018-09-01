import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule,
         MatDialogModule,
         MatTabsModule,
         MatIconModule,
         MatProgressSpinnerModule,
         MatCardModule } from '@angular/material';
import { InventoryComponent } from './inventory/inventory.component';
import { EntryDetailComponent } from './inventory/entry.component';
import { ItemDetailComponent } from './items/item.component';
import { InventoryHomeComponent } from './home/home.component';
import { ItemsComponent } from './items/items.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { SupplierDetailComponent } from './suppliers/supplier.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  declarations: [InventoryComponent,
      EntryDetailComponent,
      ItemDetailComponent,
      InventoryHomeComponent,
      ItemsComponent,
      SuppliersComponent,
     SupplierDetailComponent],
  exports: [InventoryComponent,
    ItemDetailComponent,
    EntryDetailComponent,
    InventoryHomeComponent,
    ItemsComponent,
    SuppliersComponent,
    SupplierDetailComponent
  ]
})
export class InventoryModule { }
