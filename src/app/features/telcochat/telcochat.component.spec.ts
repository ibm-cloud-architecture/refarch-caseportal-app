import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelcochatComponent } from './telcochat.component';

describe('TelcochatComponent', () => {
  let component: TelcochatComponent;
  let fixture: ComponentFixture<TelcochatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelcochatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelcochatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
