import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {Location} from "@angular/common";
import { TelcoHomeComponent } from './telcohome.component';
import { TelcoChatComponent } from './telcochat/telcochat.component';
import { SharedModule } from '../../shared/shared.module';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';

 const routes: Routes = [
    { path: 'telcoChat', component: TelcoChatComponent}
  ]
xdescribe('TelcoHomeComponent', () => {
  let component: TelcoHomeComponent;
  let fixture: ComponentFixture<TelcoHomeComponent>;
  let routerService, location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule,
        RouterTestingModule.withRoutes(routes),
        ],
      declarations: [ TelcoHomeComponent, TelcoChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerService = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an account tile', () => {
    const tile = fixture.debugElement.query(By.css('#account'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.urlPath).toContain('account');
  });

  it('should have an billing tile', () => {
    const tile = fixture.debugElement.query(By.css('#billing'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.title).toContain('bill');
  });

  it('should have an chat tile', () => {
    const tile = fixture.debugElement.query(By.css('#chat'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.title).toContain('Support');
  });

  it('should go to telcochat url when clicking on telcoChat link', () => {
    const tile = fixture.debugElement.query(By.css('#chat'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.urlPath).toContain('telcoChat');
    tile.nativeElement.querySelector('#button').click();
    fixture.whenStable().then(() => {
        expect(location.path()).toBe('/telcoChat')
    })
  });
});
