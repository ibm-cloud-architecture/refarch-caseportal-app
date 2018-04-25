import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'pp-component-wrapper',
    template: `
    <app-input
        [id]="\'username\'"
        [(model)]="username"
        [validations]="usernameVals">
    </app-input>
    <app-input
       [id]="\'password\'"
       [(model)]="password"
       [validations]="passwordVals">
    </app-input>
    <app-input
      [id]="'answer'"
      [(model)]="answer"
      [validations]="securityVals">
    </app-input>
  `
})
class WrapperComponent {
    password: string;
    username: string;
    answer: string;
    // control the validation mechanism by using type, and reporting a msg
    passwordVals: Array<{ type: string, msg?: string }> = [
        { type: 'required' },
        { type: 'passwordValidity', msg: 'Password criteria not met' }
    ];
    usernameVals: Array<{type: string, msg?: string}> = [
        {type: 'required'},
        {type: 'usernameValidity', msg: 'Username criteria not met'}
    ];
    securityVals: Array<{ type: string, msg?: string, length?: number }> = [
        { type: 'required' },
        { type: 'length', length: 50, msg: 'Answer too long' }
    ];
}

describe('InputComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        InputComponent,
        WrapperComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('password validation ', () => {
    it('should not report any error message with matching password', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('$Passw0rd');
      expect(inputComponent.errorMsg).toEqual('');
      expect(component.password).toEqual('$Passw0rd');
    }));

    it('should report error message too short password', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('hhs1@');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('hhs1@');
    }));

    it('should report error message too long password', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('h$1hadsgj;lakdfoi');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('h$1hadsgj;lakdfoi');
    }));

    it('should report error message for password without special char', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('123ab678');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('123ab678');
    }));

    it('should report error message for password without digit ', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('asaaddsbc');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('asaaddsbc');
    }));

    it('should report error message for password without letter ', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('123456&866');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('123456&866');
    }));

    it('should report error message for password start with space ', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change(' 1sbd56&866');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual(' 1sbd56&866');
    }));

    it('should report error message for password end with space ', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('1sbd56&866 ');
      expect(inputComponent.errorMsg).toEqual('Password criteria not met');
      expect(component.password).toEqual('1sbd56&866 ');
    }));

    it('should not report error message for good password', async(() => {
      const htmlInputE = fixture.debugElement.query(By.css('#password'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('1sbd56&866');
      expect(inputComponent.errorMsg).toEqual('');
      expect(component.password).toEqual('1sbd56&866');
    }));
  });

  describe('username validation', () => {
    it ('should accept username with 8 characters', () => {
      const htmlInputE = fixture.debugElement.query(By.css('#username'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('username');
      expect(inputComponent.errorMsg).toEqual('');
      expect(component.username).toEqual('username');
    });

    it ('should generate error if username is only digit', () => {
      const htmlInputE = fixture.debugElement.query(By.css('#username'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('12345678');
      expect(inputComponent.errorMsg).toEqual('Username criteria not met');
      expect(component.username).toEqual('12345678');
    });

    it ('should generate error if username is too short', () => {
      const htmlInputE = fixture.debugElement.query(By.css('#username'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('bill');
      expect(inputComponent.errorMsg).toEqual('Username criteria not met');
      expect(component.username).toEqual('bill');
    });
  });


  describe('security answer validation', () => {
    it ('should accept answer with less than 50 characters', () => {
      const htmlInputE = fixture.debugElement.query(By.css('#answer'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('a simple answer');
      expect(inputComponent.errorMsg).toEqual('');
      expect(component.answer).toEqual('a simple answer');
    });

    it ('should generate error if answer is too long', () => {
      const htmlInputE = fixture.debugElement.query(By.css('#answer'));
      const inputComponent = htmlInputE.componentInstance;
      inputComponent.change('1234567890 1234567890 1234567890 1234567890 1234567890');
      expect(inputComponent.errorMsg).toEqual('Answer too long');
    });
  });
});
