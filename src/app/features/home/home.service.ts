import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/**
 Service to control the features to expose to end user. This is more a demo trick
*/
@Injectable()
export class HomeService {
  private bffUrl ='/api';

    constructor(private http: HttpClient) {
    };

    // this method is used to control the user interface features.
    getMode(): Observable<string>{
      return this.http.get(this.bffUrl + '/mode');
    }

}
