import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TileComponent } from './tile.component';

fdescribe('TileComponent', () => {
  let component: TileComponent,
    router: Router;
  let fixture: ComponentFixture<TileComponent>;

  @Component({
      template: '<app-tile title="Some title" description="Some message."></app-tile>'
  })
  class HostComponent {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule.withRoutes([])
      ],
      declarations: [ TileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain correct header', () => {
        const element = fixture.debugElement.nativeElement.querySelector('h2');
        expect(element.textContent).toBe('title');
  });
});
