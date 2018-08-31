import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from './Supplier';
import { InventoryService }  from '../inventory.service';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  suppliers : Supplier[]=[];
  selectedSupplier: Supplier;
  message: string = '';
  newSupplier: boolean = false;
  loading: boolean = true;
  
  constructor(private router: Router, private invService : InventoryService) { }

  ngOnInit() {
    this.getSuppliers();
  }

  getSuppliers() {
    if (this.suppliers.length === 0) {
      this.invService.getSuppliers().subscribe(
        data => {
          this.suppliers = data;
          this.message = "";
          this.loading = false;
        },
        error => {
          this.message="Error to get the data from backend";
          if(error.status == 401){
            this.router.navigate(['login'], { queryParams: { returnUrl: '/inventory' } });
          }
          this.loading = false;
        }
      )
    }
  }

  add() : void {
    this.selectedSupplier = new Supplier();
    this.newSupplier = true;
  }

  edit(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.newSupplier = false;
  }

  supplierUpdateComplete(response: any){
    console.log('Entry Save Success:', response.success, response.entry);
    if(response.success){
      if (this.newSupplier) {
        this.suppliers.push(response.supplier);
      }
    } else {
      if (response.error !== 'cancel') {
        console.error('ERROR SAVING ITEM', response.error);
        alert(`Error Saving Item: (${response.error.status}) ${response.error.statusText}`);
        if(response.error.status == 401){
          this.router.navigate(['login'], { queryParams: { returnUrl: '/inventory' } });
        }
      }
    }
    this.selectedSupplier = null;
  }
}
