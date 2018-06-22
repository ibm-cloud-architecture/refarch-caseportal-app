import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelcoChatComponent } from './telcochat.component';
import { TelcoDemoService } from '../telcodemo.service';

fdescribe('TelcoChatComponent', () => {
  let component: TelcoChatComponent;
  let fixture: ComponentFixture<TelcoChatComponent>;
  let telcoService : TelcoDemoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoChatComponent ],
      providers: [  { provide: TelcoDemoService, useValue: userStub }]

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
