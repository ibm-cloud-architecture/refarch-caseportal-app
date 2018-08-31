import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilecardComponent } from './tilecard.component';

describe('TilecardComponent', () => {
  let component: TilecardComponent;
  let fixture: ComponentFixture<TilecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
