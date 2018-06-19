import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { SharedModule } from '../../shared/shared.module';
import { User } from '../../shared/User';


/**
* Tests in isolation using injection the login component and module
*/
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginStub;
  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));
    TestBed.configureTestingModule({
      imports: [ SharedModule,
        RouterTestingModule ],
      declarations: [ LoginComponent ],
      providers: [
          { provide: LoginService, useValue: loginStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have username as mandatory field', () => {
      const userNameElement = fixture.debugElement.query(By.css(('#usernameInput')));
      // the requirement is not on the input as html element attribute but in validation rule
      const componentInstance = userNameElement.componentInstance;
      expect(componentInstance.validations[0].type).toEqual('required');
  });

  it('should have password as mandatory field', () => {
      const element = fixture.debugElement.query(By.css(('#passwordInput')));
      // the requirement is not on the input as html element attribute but in validation rule
      const componentInstance = element.componentInstance;
      expect(componentInstance.validations[0].type).toEqual('required');
  });

  it('should have an email validity error message when email is invalid', () => {
      const userNameElement = fixture.debugElement.query(By.css(('#usernameInput')));
      const componentInstance = userNameElement.componentInstance;
      expect(componentInstance.errorMsg).toEqual('');
      componentInstance.change('testbademailaddress');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
          expect(componentInstance.errorMsg).toEqual('Valid email is required');
      });
    });

  it('should have no error message when email is valid', () => {
      const userNameElement = fixture.debugElement.query(By.css(('#usernameInput')));
      const componentInstance = userNameElement.componentInstance;
      expect(componentInstance.errorMsg).toEqual('');
      componentInstance.change('valid@email.com');
      fixture.detectChanges();
      fixture.whenStable().then(() => {
          expect(componentInstance.errorMsg).toEqual('');
      });
  });
});
