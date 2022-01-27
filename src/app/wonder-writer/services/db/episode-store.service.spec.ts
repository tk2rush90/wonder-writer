import { TestBed } from '@angular/core/testing';

import { EpisodeStoreService } from './episode-store.service';

describe('EpisodeStoreService', () => {
  let service: EpisodeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpisodeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
