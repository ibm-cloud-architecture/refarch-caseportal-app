import {Component} from '@angular/core';
import {User} from './shared/User';
import {LoginService} from './features/login/login.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user:User;
  title:string;

  constructor(private loginService: LoginService ) {
    this.user = loginService.getCurrentUser();
    this.title = 'Welcome ' + this.user.firstname;
  }
}
