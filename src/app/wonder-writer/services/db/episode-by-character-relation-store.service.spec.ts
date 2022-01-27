import { TestBed } from '@angular/core/testing';

import { EpisodeByCharacterRelationStoreService } from './episode-by-character-relation-store.service';

describe('EpisodeByCharacterRelationStoreService', () => {
  let service: EpisodeByCharacterRelationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeByCharacterRelationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
