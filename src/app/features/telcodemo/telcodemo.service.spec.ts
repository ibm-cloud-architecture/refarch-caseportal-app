import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TelcoDemoService } from './telcodemo.service';

describe('TelcodemoService', () => {
  let httpMock: HttpTestingController;
  let service: TelcoDemoService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TelcoDemoService]
    });
    service = TestBed.get(TelcoDemoService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // assess if there is no more outstanding http request
    httpMock.verify();
  }));

  it('should be created', inject([TelcoDemoService], (service: TelcoDemoService) => {
    expect(service).toBeTruthy();
  }));

  it('should do http post on submit message', () => {
    service.submitMessage("hello", {}).subscribe(
      data => {

      },
      err => {
        fail('Unexpected error: ' + err);
      });
    const req = httpMock.expectOne(service.convUrl);
    expect(req.request.method).toEqual('POST');
  });
});
