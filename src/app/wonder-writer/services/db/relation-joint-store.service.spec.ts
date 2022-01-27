import { TestBed } from '@angular/core/testing';

import { RelationJointStoreService } from './relation-joint-store.service';

describe('RelationJointStoreService', () => {
  let service: RelationJointStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationJointStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
