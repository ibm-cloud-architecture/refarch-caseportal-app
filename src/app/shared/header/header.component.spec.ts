import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter;
  beforeEach(async(() => {
    mockRouter = {navigate: jasmine.createSpy('navigate')};
    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [ HeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toBeDefined();
  });

  it('should go to logout url when clicking on logout link', () => {
    const link = fixture.nativeElement.querySelector('#logout-link');
    link.click();
    fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
    })
  });

  it('should go to home url when clicking on home link', () => {
    const link = fixture.nativeElement.querySelector('#home-link');
    link.click();
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
    })

  });
});
