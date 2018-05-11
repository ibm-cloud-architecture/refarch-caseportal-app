import { Injectable }    from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ConversationService {
  private convUrl ='/api/c/conversation/';

  constructor(private http: HttpClient) {
  };

  submitMessage(msg:string,ctx:any): Observable<any>{
    let bodyString = JSON.stringify(  { text:msg,context:ctx });

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.convUrl,bodyString,{ headers: headers });
  }
}
