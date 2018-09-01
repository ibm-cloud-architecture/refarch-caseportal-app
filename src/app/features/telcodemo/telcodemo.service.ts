import { Injectable } from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatResponse } from './telcochat/chatresponse';

@Injectable()
export class TelcoDemoService {
  public convUrl ='/api/c/telcochat/';
  private custUrl ='/api/customers';

  constructor(private http: HttpClient) {
  };

  submitMessage(msg:string,ctx:any) {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    let bodyString = JSON.stringify(  { text:msg,context:ctx,user:user });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ChatResponse>(this.convUrl,bodyString,{ headers: headers });
  }

  getCustomerByEmail(email) {
    return this.http.get(this.custUrl+'/email/'+email);
  }
}
