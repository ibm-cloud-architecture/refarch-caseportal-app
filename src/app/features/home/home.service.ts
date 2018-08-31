import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export class OperationMode {
  mode: string = "all";
}
/**
 Service to control the features to expose to end user. This is more a demo trick
*/
@Injectable()
export class HomeService {
   bffUrl ='/api/mode';

    constructor(private http: HttpClient) {
    };

    // this method is used to control the user interface features.
    getMode(): Observable<OperationMode> {
      let resp = this.http.get<OperationMode>(this.bffUrl);
      if (resp !== undefined) {
        return resp;
      }
      return of(new OperationMode());
    }

}
