import { Injectable }    from '@angular/core';
import { Headers,Response,RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class ConversationService {
  convUrl: string = '/api/c/conversation/';

  constructor(private http: HttpClient) {
  };

  submitMessage(msg:string,ctx:any) {
    let bodyString = JSON.stringify(  { text:msg,context:ctx });

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.convUrl,bodyString,{ headers: headers });
  }
}
