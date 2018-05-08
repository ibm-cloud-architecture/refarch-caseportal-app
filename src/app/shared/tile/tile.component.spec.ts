import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TileComponent } from './tile.component';
import { By } from '@angular/platform-browser';

@Component({
    template: '<app-tile id="firstTile" title="Some title" description="Some message." color="red"></app-tile>'
})
class HostComponent {}

describe('TileComponent', () => {
  let component: HostComponent,
    router: Router;
  let fixture: ComponentFixture<HostComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule.withRoutes([])
      ],
      declarations: [ TileComponent, HostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(TileComponent);
    fixture = TestBed.createComponent(HostComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a default title', () => {
        const element = fixture.debugElement.nativeElement.querySelector('h2');
        expect(element.textContent).toBe('Some title');
  });

  it('should contain style with red color', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.color).toBe('red');
  });
  

});
