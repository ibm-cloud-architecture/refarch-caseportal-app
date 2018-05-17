import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { LoginService } from '../login/login.service';
import { User } from '../../shared/User';

import { SharedModule } from '../../shared/shared.module';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let loginStub, homeServiceStub;
  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));
    homeServiceStub = jasmine.createSpyObj('homeServiceStub', ['getMode']);
    homeServiceStub.getMode.and.returnValue( Observable.of('brown'));

    TestBed.configureTestingModule({
      imports: [ SharedModule,
           RouterTestingModule,
           HttpClientTestingModule ],
      declarations: [ HomeComponent ],
      providers: [
          { provide: LoginService, useValue: loginStub },
          { provide: HomeService, useValue: homeServiceStub }
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a Welcome message with the user fist name', () => {
      expect(component.title).toContain('Welcome');
      expect(component.title).toContain('Eddie');
  });

  it('should go to inventory url when clicking on inventory link', () => {
    const tile = fixture.debugElement.query(By.css('#inventory'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.urlPath).toContain('inventory');
    tile.nativeElement.querySelector('#button').click();
    fixture.whenStable().then(() => {
        const routerService = TestBed.get(Router);
        expect(routerService.navigate.calls.any()).toBe(true, 'navigate called');
    })
  });

  it('should go to itSupport url when clicking on itSupport link', () => {
    const tile = fixture.debugElement.query(By.css('#itSupport'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.urlPath).toContain('itSupport');
    tile.nativeElement.querySelector('#button').click();
    fixture.whenStable().then(() => {
        const routerService = TestBed.get(Router);
        expect(routerService.navigate.calls.any()).toBe(true, 'navigate called');
    })
  });

  it('should go to telcoDemo url when clicking on telcoDemo link', () => {
    const tile = fixture.debugElement.query(By.css('#telcoDemo'));
    expect(tile).toBeDefined();
    expect(tile.componentInstance.urlPath).toContain('telcohome');
    tile.nativeElement.querySelector('#button').click();
    fixture.whenStable().then(() => {
        const routerService = TestBed.get(Router);
        expect(routerService.navigate.calls.any()).toBe(true, 'navigate called');
    })
  });
});
