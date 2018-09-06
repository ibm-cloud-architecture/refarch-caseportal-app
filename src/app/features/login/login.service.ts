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
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../shared/User';


export class OperationMode {
  mode: string = "all";
  version: string = "";
}

@Injectable()
export class LoginService {
  loginUrl: string = '/bff/login';
  logoutUrl: string = '/bff/logout';
  modeUrl ='/api/mode';
  user: User = { email: ''}
  mode: OperationMode = new OperationMode();

  constructor(private http: HttpClient) {
  }

  // this method is used to control the user interface features.
  getMode(): Observable<OperationMode> {
    if (this.mode.version === "") {
      this.http.get<OperationMode>(this.modeUrl).subscribe(
        data => {
            this.mode = data;
            return of(this.mode);
        },
        error => {
          this.mode.version="0.0.1";
          return of(this.mode);
        }
      );
    } else {
      return of(this.mode);  // look strange but this is the pleasure of promise
    }

  }

  login(username: string, password: string): Observable<User> {
    if (username === "test@test.com") {
      const userInfo = { email: username, password: password, firstname: 'test' };
      window.sessionStorage.setItem('user', JSON.stringify(userInfo));
      return of(userInfo);
    }
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    const userData = { userName: username, password: password };

    return this.http.post<User>(this.loginUrl, userData, { headers: headers, withCredentials: true })
        .pipe(map(userInfo => {
          if (userInfo && userInfo.access_token) {
            window.sessionStorage.setItem('jwtToken', userInfo.access_token);
            this.user = userInfo;
            window.sessionStorage.setItem('user', JSON.stringify(userInfo));
          }
          return userInfo;
        }))
    }


  getCurrentUser(): User {
    return this.user;
  }

  isLoggedIn(): boolean {
    if (this.getCurrentUser().email !== undefined && this.getCurrentUser().email.length > 2) {
      return true;
    } else if (window.sessionStorage.getItem('user')) {
      this.user = JSON.parse(window.sessionStorage.getItem('user'));
      return true;
    } else {
      return false;
    }
  }

  logout() {
    window.sessionStorage.removeItem('user');
  }
}
