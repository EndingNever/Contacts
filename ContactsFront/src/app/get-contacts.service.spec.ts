import { TestBed } from '@angular/core/testing';

import { GetContactsService } from './get-contacts.service';

describe('GetContactsService', () => {
  let service: GetContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
