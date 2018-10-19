import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoginService } from './login.service';
import { User } from '../../shared/User';

describe('LoginService', () => {
  let loginService: LoginService;
  let httpMock: HttpTestingController;
  let store = {};
  const mockSessionStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    spyOn(window.sessionStorage, 'getItem')
      .and.callFake(mockSessionStorage.getItem);
    spyOn(window.sessionStorage, 'setItem')
      .and.callFake(mockSessionStorage.setItem);
    spyOn(window.sessionStorage, 'removeItem')
      .and.callFake(mockSessionStorage.removeItem);
    spyOn(window.sessionStorage, 'clear')
      .and.callFake(mockSessionStorage.clear);
    loginService = TestBed.get(LoginService);
    httpMock = TestBed.get(HttpTestingController);
  });


  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // assess if there is no more outstanding http request
    httpMock.verify();
    // better to clean the SessionStorage
    mockSessionStorage.clear();
  }));


  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should get a user when calling login given username and password', () => {
      let user: User;
      loginService.login("eddie@email.com","eddie").subscribe(
        user => {
            expect(user.firstname).toEqual('eddie');
        },
        err => {
          fail('Unexpected error: ' + err);
        });
      const req = httpMock.expectOne(loginService.loginUrl);
      expect(req.request.method).toEqual('POST');
      req.flush({firstname: "eddie", email: "eddie@email.com"});
  });

 it('should have loggedIn being true when user is logged in', () => {
   mockSessionStorage.setItem('user', '{"lastname": "biloute","firstname": "eddir","email": "eddie@email.com"}');
   expect(loginService.isLoggedIn()).toBeTruthy();
 });
/*
 it('should get a valid mode', () => {
   expect(loginService.getMode().mode).toEqual('all');
   const req = httpMock.expectOne(loginService.modeUrl);
   expect(req.request.method).toEqual('GET');
   req.flush({mode:"all"});
 });
 */
});
