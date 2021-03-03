import { TestBed } from '@angular/core/testing';

import { NoLoginGuardService } from './no-login-guard.service';

describe('NoLoginGuardService', () => {
  let service: NoLoginGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoLoginGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
