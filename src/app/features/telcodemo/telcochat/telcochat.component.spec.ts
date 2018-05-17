import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelcoChatComponent } from './telcochat.component';

describe('TelcoChatComponent', () => {
  let component: TelcoChatComponent;
  let fixture: ComponentFixture<TelcoChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcoChatComponent ]
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
