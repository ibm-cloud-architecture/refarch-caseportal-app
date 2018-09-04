import { Component, OnInit } from '@angular/core';
import { TelcoDemoService }  from '../telcodemo.service';
import { Customer } from '../customer/customer';
import { User } from "../../login/User";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user: User;
  customer: Customer;
  error: String;

  constructor(customerService : TelcoDemoService) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if( ( this.customer === undefined) && this.user && 'email' in this.user) {
      customerService.getCustomerByEmail(this.user.email).subscribe(
          data => {
            this.customer=data;
          },
          error => {
            console.log(error);
            this.error="An error occurs on backend, try again later.";
          });
    }

  }

  ngOnInit() {
  }

}
