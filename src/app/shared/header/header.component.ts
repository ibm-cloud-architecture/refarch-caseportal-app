import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title:string = 'CASE Portal';
  logged:boolean = false;

  constructor(private router: Router) { };


  ngOnInit() {
    this.logged = (localStorage.getItem('user') !== undefined);
  }

  logout() {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
  }

  home() {
      this.router.navigate(['home']);
  }
}
