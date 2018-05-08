import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
});
