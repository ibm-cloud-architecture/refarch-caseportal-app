import { TestBed, inject } from '@angular/core/testing';

import { TelcoDemoService } from './telcodemo.service';

describe('TelcodemoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TelcoDemoService]
    });
  });

  it('should be created', inject([TelcoDemoService], (service: TelcoDemoService) => {
    expect(service).toBeTruthy();
  }));
});
