import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeService } from './home.service';

describe('HomeService', () => {
  beforeEach(() => {
    let httpMock: HttpTestingController;
    let homeService: HomeService;
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


});
