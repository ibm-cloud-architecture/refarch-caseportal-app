import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConversationComponent } from './conversation.component';
import { ConversationService } from './conversation.service';
import { Observable } from 'rxjs/Observable';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let convServ;
  beforeEach(async(() => {
    convServ = jasmine.createSpyObj('convServiceStub', ['submitMessage']);
    convServ.submitMessage.and.returnValue(Observable.of({context: {}, output: {text:"Hello from bot"}}));
    TestBed.configureTestingModule({
      imports: [
        FormsModule],
      declarations: [ ConversationComponent,
      ],
      providers: [  { provide: ConversationService, useValue: convServ }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
