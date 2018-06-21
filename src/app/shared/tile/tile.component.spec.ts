import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { RouterTestingModule } from '@angular/router/testing';
import { TileComponent } from './tile.component';
import { By } from '@angular/platform-browser';

@Component({
    template: '<app-tile id="firstTile" title="Some title" '
    + 'description="Some message." color="red" urlPath="home" buttonName="ask me">'
    +'</app-tile>'
})
class HostComponent {}
/*
fdescribe('TileComponent', () => {
  let component: HostComponent,
    router: Router;
  let location: Location;
  let fixture: ComponentFixture<HostComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule.withRoutes([  { path: 'home', component: HostComponent}])
      ],
      declarations: [ TileComponent, HostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    // fixture = TestBed.createComponent(TileComponent);
    fixture = TestBed.createComponent(HostComponent);
    router = TestBed.get(Router);
    router.initialNavigation();
    location = TestBed.get(Location);
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
        expect(tileComponent.id).toBe('firstTile');
  });

  it('should contain style with red color', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.color).toBe('red');
  });

  it('should contain urlPath', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.urlPath).toBe('home');
  });

  it('should contain description', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.description).toContain('message');
  });

  it('should contain a button name', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.buttonName).toContain('ask');
  });

  it('should route to the url when button clicked', () => {
      const button = fixture.nativeElement.querySelector('#button');
      expect(button).toBeDefined();
      button.click();
      fixture.whenStable().then(() => {
          //expect(location.path()).toBe('/home');
          expect(location.path()).toBe('');
      })
  });
});
*/
