import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ConversationService } from './conversation.service';


describe('ConversationService', () => {
  let convServ = ConversationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ ConversationService ]
    });
    convServ = TestBed.get(ConversationService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([ConversationService], (service: ConversationService) => {
    expect(service).toBeTruthy();
  }));

  it('should send a chat message via POST', () => {
    convServ.submitMessage("I need help",{}).toEqual('How can I help you');
    const req = httpMock.expectOne(convServ.convUrl);
    expect(req.request.method).toEqual('POST');
    req.flush({message: "How can I help you", context: {}});
  })
});
