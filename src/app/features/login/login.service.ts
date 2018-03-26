import { Injectable } from '@angular/core';
import { User } from '../../shared/User';

@Injectable()
export class LoginService {
  user: User;

  constructor() {
    // FIXME mockup
    this.user = new User('eddie@email.con','Eddie','pwd');
  }

  login(uname: string, pwd: string): User {
    // TODO add call to remote login service
    return this.getCurrentUser();
  }

  getCurrentUser(): User {
    return this.user;
  }
}
