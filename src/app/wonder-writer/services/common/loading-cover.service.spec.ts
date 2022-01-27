import { TestBed } from '@angular/core/testing';

import { LoadingCoverService } from './loading-cover.service';

describe('LoadingCoverService', () => {
  let service: LoadingCoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingCoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
