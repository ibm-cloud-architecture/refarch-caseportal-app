import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entry } from './Entry';
import { InventoryService }  from '../inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // present a list of items in a table layout
  entries : Entry[]=[];
  selectedEntry: Entry;
  message: string = '';
  newEntry: boolean = false;
  loading: boolean = true;

  constructor(private router: Router, private invService : InventoryService) { }

  // Uses in init to load data and not the constructor.
  ngOnInit(): void {
    this.getEntries();
  }


  /**
  Modify the list of items by loading them from backend service
  */
  getEntries(): void {
    if (this.entries.length === 0) {
      this.invService.getInventory().subscribe(
        data => {
          this.entries = data;
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

  /**
    Edit the item use the item-detail directive so just set the selectedItem
    */
    edit(entry): void {
      this.selectedEntry = entry;
      this.newEntry = false;
    }

    remove(i): void {
      this.invService.deleteItem(this.entries[i].id).subscribe(
          data => {
            var updatedItems = this.entries.slice();
            updatedItems.splice(i, 1);
            this.entries=updatedItems;
            this.message="Remove item successful";
            this.selectedEntry=null;
          },
          error =>{
            console.error('Error in removing item...', error)
            alert(`${error.status}: ${error.statusText}`);
            this.message="Error in removing item,... the error is reported to administrator.";
            this.selectedEntry=null;
            if(error.status == 401){
              this.router.navigate(['login'], { queryParams: { returnUrl: '/inventory' } });
            }
          }
      );

    }

    add() : void {
      this.selectedEntry = new Entry();
      this.selectedEntry['quantity']=0;
      this.newEntry = true;
    }


    entryUpdateComplete(response: any){
      console.log('Entry Save Success:', response.success, response.entry);
      if(response.success){
        if (this.newEntry) {
          this.entries.push(response.entry);
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
      this.selectedEntry = null;
    } // entry update

}
