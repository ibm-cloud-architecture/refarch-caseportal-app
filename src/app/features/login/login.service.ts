/**
The login service is used to login and logout to the application. For
login it posts the users credentials to the BFF login api and checks the response for a
JWT token, if there is one it means authentication was successful so the user
details including the token are added to local storage.

Using local storage the users will stay logged in if they refresh the browser and also between browser sessions until
they logout. If you don't want the user to stay logged in between refreshes or
sessions the behavior could easily be changed by storing user details somewhere
 less persistent such as session storage or in a property of the login
 service.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { User } from '../../shared/User';

@Injectable()
export class LoginService {
  loginUrl: string = '/bff/login';
  logoutUrl: string = '/bff/logout';
  user: User = { email: ''}

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<User> {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

      const userData = { userName: username, password: password };

      return this.http.post(this.loginUrl, userData, { headers: headers, withCredentials: true })
        // .do is a pass-through. Pull the token out and store it (always there)
        .do((userInfo: User) => {
          window.sessionStorage.setItem('jwtToken', userInfo.token);
          this.user = userInfo;
          window.sessionStorage.setItem('user', JSON.stringify(userInfo));
        })
    }


  getCurrentUser(): User {
    return this.user;
  }

  isLoggedIn(): boolean {
    if (this.getCurrentUser().email.length > 2) {
      return true;
    } else if (window.sessionStorage.getItem('user')) {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      return true;
    } else {
      return false;
    }
  }
}
