import { TestBed } from '@angular/core/testing';

import { CharacterByCharacterRelationStoreService } from './character-by-character-relation-store.service';

describe('CharacterByCharacterRelationStoreService', () => {
  let service: CharacterByCharacterRelationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterByCharacterRelationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
