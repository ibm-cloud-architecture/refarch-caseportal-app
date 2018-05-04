import { Component } from '@angular/core';
import { Router }   from '@angular/router';
import { LoginService } from '../login/login.service';
import { HomeService }  from './home.service';
import { User } from '../../shared/User';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  mode:string = 'all';
  user:User;
  title:string;

  constructor(private loginService: LoginService,
              private router: Router,
              private homeService : HomeService ) {
    this.user = loginService.getCurrentUser();
    this.title = 'Welcome ' + this.user.firstname;
    this.homeService.getMode().subscribe(
        data => {this.mode = data.mode;},
        error => {console.log(error);}
      )
  }
  // each features is a tile
  inventory(){
    this.router.navigate(['inventory']);
  }


  itSupport(){
    this.router.navigate(['itSupport']);
  }
  // ADD Here methods to be called from HTLM button to route to other component

  logout(){
      localStorage.removeItem('currentUser');
      this.user = new User();
      this.router.navigate(['log']);
  }

  dcm(){
      this.router.navigate(['dcm']);
  }

  hcAdvise(){
    this.router.navigate(['advisor']);
  }

  customer(){
    this.router.navigate(['customer']);
  }
}
