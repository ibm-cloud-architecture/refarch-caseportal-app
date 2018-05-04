import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
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
      email: '',
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

  constructor(private loginService: LoginService,
    private router: Router,) {
    }

  ngOnInit() {
  }

  onInputChange() {
    // clean the error message
    this.errorMsg = '';
  }

  clickedLogin() {
    if (!Boolean(this.loginRequest.email) || !Boolean(this.loginRequest.password)) {
      return;
    } else {
      this.components.forEach(
        (input: InputComponent) => {
          if (! input.validate()) return;
        }
      );
    }
    this.loginService.login(this.loginRequest.email, this.loginRequest.password).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      error => {
        if (error.status === 401) {
          this.errorMsg = 'Your username or password does not match the record';
        } else if (error.status === 403) {
          this.errorMsg = 'For your security, we\'ve locked your privacy portal account. Please contact ….';
        } else {
          throw error;
        }
      }
    );
  }
}
