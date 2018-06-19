import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let httpMock: HttpTestingController;
  let homeService: HomeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService]
    });
    homeService = TestBed.get(HomeService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([HomeService], (service: HomeService) => {
    expect(service).toBeTruthy();
  }));

  it('should get a valid mode', () => {
    homeService.getMode().subscribe(
      data => { expect(data.mode).toEqual('green');}
    );
    const req = httpMock.expectOne(homeService.bffUrl);
    expect(req.request.method).toEqual('GET');
    req.flush({mode:"green"});
  });
});
