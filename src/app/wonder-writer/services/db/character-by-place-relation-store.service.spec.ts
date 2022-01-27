import { TestBed } from '@angular/core/testing';

import { CharacterByPlaceRelationStoreService } from './character-by-place-relation-store.service';

describe('CharacterByPlaceRelationStoreService', () => {
  let service: CharacterByPlaceRelationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterByPlaceRelationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
