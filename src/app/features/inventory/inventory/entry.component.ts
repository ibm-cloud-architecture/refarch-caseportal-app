import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { InventoryService }  from '../inventory.service';
import { Entry } from './Entry';

@Component({
  selector: 'entry-detail',
  templateUrl:'entry.component.html'
})
export class EntryDetailComponent implements OnInit {
  // Entry is injected by the parent inventory component. As new entry or from an existing one
  @Input() entry: Entry;
  @Input() newEntry : boolean;
  // specify to the parent we are done with editing -> saving
  @Output() onComplete = new EventEmitter<any>();
  message : string ="";

  // delegate the call to BFF via local service
  constructor(private invService : InventoryService){
  }

  ngOnInit(): void {
    console.log(JSON.stringify(this.entry));
  }

  save(): void  {
    if (this.newEntry) {
      this.invService.saveInventory(this.newEntry).subscribe(
          data => {
            console.log('data from saveInventory',data)
            this.entry = data;
            this.entry.id = data[0].id;
            this.message="Success";
            this.onComplete.emit({success: true, entry: this.entry});
          },
          error => {
            console.error("Error on save operation:"+error);
            this.message="Error on save";
            this.onComplete.emit({success: false, entry: this.entry, error: error});
          }
        );
    } else {
      this.invService.updateItem(this.entry).subscribe(
          data => {
            // this.item=data;
            this.message="Success";
            this.onComplete.emit({success: true, entry: this.entry});
          },
          error => {
            console.error("Error on save operation:"+error);
            this.message="Error on save";
            this.onComplete.emit({success: false, entry: this.entry, error: error});
          }
        );
    }
  }

  back(){
      this.onComplete.emit({success: false, item: this.entry, error: 'cancel'});
  }
}
