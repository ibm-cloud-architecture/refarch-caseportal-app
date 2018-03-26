import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { LoginService } from './features/login/login.service';
import { User } from './shared/user';

describe('Home Component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let loginStub;

  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));

    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        HomeComponent
      ],
      providers: [
        { provide: LoginService, useValue: loginStub }
      ]
    }).compileComponents();
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

  xit('should load a user',async( ()=> {
      const fixture = TestBed.createComponent(HomeComponent);
      const home = fixture.debugElement.componentInstance;
      expect(home.user).toBeTruthy();
      expect(home.user.email).toContain('@');
    }
  ));
})
