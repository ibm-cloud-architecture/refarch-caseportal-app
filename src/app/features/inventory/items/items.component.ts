import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from './Item';
import { InventoryService }  from '../inventory.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  // present a list of items in a table layout
  items : Item[]=[];
  selectedItem: Item;
  message: string = '';
  newItem: boolean = false;
  loading: boolean = true;

  constructor(private router: Router, private invService : InventoryService) { }

  // Uses in init to load data and not the constructor.
  ngOnInit(): void {
    this.getItems();
  }


  /**
  Modify the list of items by loading them from backend service
  */
  getItems(): void {
    if (this.items.length === 0) {
      this.invService.getItems().subscribe(
        data => {
          this.items = data;
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
    edit(item: Item): void {
      this.selectedItem = item;
      this.newItem = false;
    }

    remove(i): void {
      this.invService.deleteItem(this.items[i].id).subscribe(
          data => {
            var updatedItems = this.items.slice();
            updatedItems.splice(i, 1);
            this.items=updatedItems;
            this.message="Remove item successful";
            this.selectedItem=null;
          },
          error =>{
            console.error('Error in removing item...', error)
            alert(`${error.status}: ${error.statusText}`);
            this.message="Error in removing item,... the error is reported to administrator.";
            this.selectedItem=null;
            if(error.status == 401){
              this.router.navigate(['login'], { queryParams: { returnUrl: '/inventory' } });
            }
          }
      );

    }

    add() : void {
      this.selectedItem = new Item();
      this.selectedItem['quantity']=0;
      this.newItem = true;
    }

    itemUpdateComplete(response: any){
      console.log('Item Save Success:', response.success, response.item)
      if(response.success) {
        if (this.newItem) {
          this.items.push(response.item);
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
      this.selectedItem = null;
    } // item update

}
