import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { LoginService } from '../login/login.service';
import { User } from '../../shared/User';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let loginStub;
  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
          { provide: LoginService, useValue: loginStub }
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
