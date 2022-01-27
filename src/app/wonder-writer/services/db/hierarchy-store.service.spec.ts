import { TestBed } from '@angular/core/testing';

import { HierarchyStoreService } from './hierarchy-store.service';

describe('HierarchyDbService', () => {
  let service: HierarchyStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HierarchyStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
