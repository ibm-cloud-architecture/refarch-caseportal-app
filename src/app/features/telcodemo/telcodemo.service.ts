import { Injectable } from '@angular/core';
import { Headers, Http,Response,RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatResponse } from './telcochat/chatresponse';
import { Customer } from './customer/customer';

@Injectable()
export class TelcoDemoService {
  public convUrl ='/api/c/telcochat/';
  private custUrl ='/api/customers';

  constructor(private http: HttpClient) {
  };

  submitMessage(msg:string,ctx:any) {
    let user = JSON.parse(sessionStorage.getItem('user'));
    let bodyString = JSON.stringify(  { text:msg,context:ctx,user:user });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ChatResponse>(this.convUrl,bodyString,{ headers: headers });
  }

  getCustomers() {
    return this.http.get<Customer[]>(this.custUrl);
  }

  getCustomerByEmail(email){
    return this.http.get<Customer>(this.custUrl+'/email/'+email);
  }

  saveCustomer(c) {
    return this.http.post<Customer>(this.custUrl+'/customers',{customer:c});
  }

  updateCustomer(c) {
    return this.http.put<Customer>(this.custUrl+'/customers',{customer:c});
  }

  deleteCustomer(idx) {
    return this.http.delete(this.custUrl+'/customers/'+idx);
  }
}
