import { TestBed } from '@angular/core/testing';

import { ManuscriptStoreService } from './manuscript-store.service';

describe('ManuscriptStoreService', () => {
  let service: ManuscriptStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManuscriptStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
