import { Injectable } from '@angular/core';
import { User } from '../../shared/User';

@Injectable()
export class LoginService {
  user: User;

  constructor() {
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
