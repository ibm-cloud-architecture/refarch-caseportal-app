import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entry } from "./inventory/Entry";
import { Item } from "./items/Item";
import { User } from "../../shared/User";
import { Supplier } from './suppliers/Supplier';
@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: HttpClient) {
  };

  getItems() {
    return this.http.get<Item[]>(this.invUrl+'/items');
  }

  saveItem(i) {
    return this.http.post<Item>(this.invUrl+'/items',{item:i});
  }

  updateItem(i) {
    return this.http.put(this.invUrl+'/items',{item:i});
  }

  deleteItem(idx) {
    return this.http.delete(this.invUrl+'/items/'+idx);
  }

  getInventory() { // /api/i/entries
    return this.http.get<Entry[]>(this.invUrl+'/entries');
  }

  saveInventory(s) {
    return this.http.post<Entry>(this.invUrl+'/entries',{entry:s});
  }

  updateInventory(s) {
    return this.http.put(this.invUrl+'/entries',{entry:s});
  }

  getSuppliers() { // /api/i/entries
    return this.http.get<Supplier[]>(this.invUrl+'/suppliers');
  }

  saveSupplier(s) {
    return this.http.post<Supplier>(this.invUrl+'/suppliers',{supplier:s});
  }

  updateSupplier(s) {
    return this.http.put(this.invUrl+'/suppliers',{supplier:s});
  }
}
