import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { InputComponent } from '../../shared/input/input.component';
import { User, LoginRequest } from '../../shared/User';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChildren(InputComponent) components: QueryList<InputComponent>;
  // model to keep userid and password
  loginRequest: LoginRequest = {
      userName: '',
      password: ''
  };
  // constraints on the input fields used in the page
  usernameVals: Array<{ type: string, msg: string }> = [
    { type: 'required', msg: 'An email address as username is required' },
    { type: 'emailValidity', msg: 'Valid email is required'}
  ];

  passwordVals: Array<{ type: string, msg: string }> = [
    { type: 'required', msg: 'A password is required' }
  ];

  errorMsg: string;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  onInputChange() {
    // clean the error message
    this.errorMsg = '';
  }

  clickedLogin() {
    // do not allow login with empty username or password
    if (!Boolean(this.loginRequest.userName) || !Boolean(this.loginRequest.password)) {
      this.components.forEach(
        (input: InputComponent) => input.validate()
      );
      return;
    }
  }
}
