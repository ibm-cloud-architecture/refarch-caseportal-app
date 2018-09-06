import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../features/login/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  version: string = "v0.0.1";
  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.loginService.getMode().subscribe(
    data => {this.version = data.version;}
  );
  }

}
