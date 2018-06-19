import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';

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
    getMode() {
      return this.http.get<OperationMode>(this.bffUrl).pipe(first()).subscribe(
        data => { return data.mode;},
        error => { return "all"}
      );
    }

}
