import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
  it('should get a user', inject([AuthenticationService], (service: AuthenticationService) => {
    const user=service.login('eddie@email.com');
    expect(user).toBeTruthy();
    expect(user.email).toBe('eddie@email.com');
  }));
});
