import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InventoryService }  from '../inventory.service';
import { Supplier } from './Supplier';

@Component({
  selector: 'supplier-detail',
  templateUrl:'supplier.component.html'
})
export class SupplierDetailComponent {
  @Input() supplier: Supplier;
  @Input() newSupplier : boolean;
  // specify to the parent we are done with editing -> saving
  @Output() onComplete = new EventEmitter<any>();
  message : string ="";

  // delegate the call to BFF via local service
  constructor(private invService : InventoryService){
  }

  save(): void  {
    if (this.newSupplier) {
      this.invService.saveSupplier(this.supplier).subscribe(
          data => {
            console.log('data from saveItem',data)
            this.supplier=data;
            this.supplier.id = data[0].id;
            this.message="Success";
            this.onComplete.emit({success: true, item: this.supplier});
          },
          error => {
            console.error("Error on save operation:"+error);
            this.message="Error on save";
            this.onComplete.emit({success: false, item: this.supplier, error: error});
          }
        );
    } else {
      this.invService.updateSupplier(this.supplier).subscribe(
          data => {
            // this.item=data;
            this.message="Success";
            this.onComplete.emit({success: true, item: this.supplier});
          },
          error => {
            console.error("Error on save operation:"+error);
            this.message="Error on save";
            this.onComplete.emit({success: false, item: this.supplier, error: error});
          }
        );
    }
  }

  back(){
      this.onComplete.emit({success: false, supplier: this.supplier, error: 'cancel'});
  }
}
