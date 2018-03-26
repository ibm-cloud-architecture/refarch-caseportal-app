import { Injectable } from '@angular/core';
import { User } from '../shared/User';
@Injectable()
export class AuthenticationService {

  constructor() { }

  login(name:string):User {
    return new User(name,'pwd','tk');
  }
}
