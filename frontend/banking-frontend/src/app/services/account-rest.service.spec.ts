import { TestBed } from '@angular/core/testing';

import { AccountRestService } from './account-rest.service';

describe('AccountRestService', () => {
  let service: AccountRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
