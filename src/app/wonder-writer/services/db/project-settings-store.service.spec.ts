import { TestBed } from '@angular/core/testing';

import { ProjectSettingsStoreService } from './project-settings-store.service';

describe('ProjectSettingsStoreService', () => {
  let service: ProjectSettingsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSettingsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
