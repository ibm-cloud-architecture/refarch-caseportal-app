import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(public loginService: LoginService, public router: Router) { }

  canActivate(): boolean {
    if (! this.loginService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
