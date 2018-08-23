import { Injectable }    from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomersService {
  private custUrl ='/api/cust';

  constructor(private http: HttpClient) {

  };

  getCustomers(): Observable<any>{
    return this.http.get(this.custUrl+'/customers')
         .pipe(map((res:Response) =>
          res.json()))
  }

  getCustomerByEmail(email): Observable<any>{
    return this.http.get(this.custUrl+'/customers/email/'+email)
         .pipe(map((res:Response) =>
          res.json()))
  }

  saveCustomer(c) : Observable<any> {
    return this.http.post(this.custUrl+'/customers',{customer:c}).pipe(map((res:Response) => res.json()));
  }

  updateCustomer(c): Observable<any> {
      return this.http.put(this.custUrl+'/customers',{customer:c}).pipe(map((res:Response) => res.json()));
  }

  deleteCustomer(idx) : Observable<any> {
    return this.http.delete(this.custUrl+'/customers/'+idx)
    .pipe(map((res:Response) =>
       res.json()));
  }

}
