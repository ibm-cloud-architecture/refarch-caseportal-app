import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from "./Item";
import { User } from "../../shared/User";

@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: HttpClient) {
  };

  getItems() {
    return this.http.get<Item[]>(this.invUrl+'/items');
  }

  saveItem(i) {
    return this.http.post(this.invUrl+'/items',{item:i});
  }

  updateItem(i) {
    return this.http.put(this.invUrl+'/items',{item:i});
  }

  deleteItem(idx) {
    return this.http.delete(this.invUrl+'/items/'+idx);
  }
}
