import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelcoChatComponent } from './telcochat.component';
import { TelcoDemoService } from '../telcodemo.service';
import { Observable, of } from 'rxjs';

export class ConvStub {
  public submitMessage(msg: string, ctx: any): Observable<any> {
    return of({});
  }
}

describe('TelcoChatComponent', () => {
  let component: TelcoChatComponent;
  let fixture: ComponentFixture<TelcoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoChatComponent ],
      providers: [  { provide: TelcoDemoService, useClass: ConvStub }]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
