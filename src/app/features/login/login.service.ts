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
import { User } from '../../shared/User';

@Injectable()
export class LoginService {
  user: User;

  constructor(private http: HttpClient) {
    // FIXME mockup
    this.user = new User('eddie@email.com','Eddie','pwd');
  }

  login(uname: string, pwd: string): User {
    // TODO add call to remote login service
    return this.getCurrentUser();
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
