import { Component, OnInit, Input } from '@angular/core';
import { Router }   from '@angular/router';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input()
  color: string = '#8c4507';
  @Input()
  title: string = 'title';
  @Input()
  description: string = 'Short description';
  @Input()
  buttonName: string = 'Submit';
  @Input()
  urlPath: string = 'home';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  submit() {
      this.router.navigate([this.urlPath]);
  }

}
