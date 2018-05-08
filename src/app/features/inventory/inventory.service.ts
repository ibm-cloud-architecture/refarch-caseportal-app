import { Injectable }    from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Item } from "./Item";
import { User } from "../../shared/User";

@Injectable()
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {

  };

  getItems(): Observable<any>{
    return this.http.get(this.invUrl+'/items')
         .map((res:Response) =>
          res.json())
  }

  saveItem(i) : Observable<any> {

    return this.http.post(this.invUrl+'/items',{item:i}).map((res:Response) => res.json());
  }

  updateItem(i) : Observable<any> {
    return this.http.put(this.invUrl+'/items',{item:i}).map((res:Response) => res.json());
  }

  deleteItem(idx) : Observable<any> {
    return this.http.delete(this.invUrl+'/items/'+idx)
    .map((res:Response) =>
       res.json());
  }
}
