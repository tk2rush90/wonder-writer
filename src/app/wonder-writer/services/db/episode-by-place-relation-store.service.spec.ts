import { TestBed } from '@angular/core/testing';

import { EpisodeByPlaceRelationStoreService } from './episode-by-place-relation-store.service';

describe('EpisodeByPlaceRelationStoreService', () => {
  let service: EpisodeByPlaceRelationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeByPlaceRelationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
