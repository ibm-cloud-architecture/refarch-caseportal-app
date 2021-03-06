import { Component } from '@angular/core';
import { Router }   from '@angular/router';

import { LoginService } from '../login/login.service';
import { User } from '../../shared/User';
import { TileComponent } from '../../shared/tile/tile.component';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user:User;
  title:string;

  constructor(private loginService: LoginService,
              private router: Router) {
    this.user = loginService.getCurrentUser();
    this.title = 'Welcome ' + this.user.firstname;
  }

  logout() {
    this.user = null;
    this.router.navigate(['/login']);
  }
}
