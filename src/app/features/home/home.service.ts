import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/**
 Service to control the features to expose to end user. This is more a demo trick
*/
@Injectable()
export class HomeService {
  private bffUrl ='/api';

    constructor(private http: Http) {
    };

    // this method is used to control the user interface features.
    getMode(): Observable<any>{
      return this.http.get(this.bffUrl+'/mode')
           .map((res:Response) => res.json())
    }

}
