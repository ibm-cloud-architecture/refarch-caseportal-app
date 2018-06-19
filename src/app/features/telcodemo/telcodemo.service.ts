import { Injectable } from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatResponse } from './telcochat/chatresponse';

@Injectable()
export class TelcoDemoService {
  private convUrl ='/api/c/telcochat/';

  constructor(private http: HttpClient) {
  };

  submitMessage(msg:string,ctx:any) {
    let bodyString = JSON.stringify(  { text:msg,context:ctx });

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ChatResponse>(this.convUrl,bodyString,{ headers: headers });
  }
}
