import { TestBed } from '@angular/core/testing';

import { PlaceStoreService } from './place-store.service';

describe('PlaceStoreService', () => {
  let service: PlaceStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
