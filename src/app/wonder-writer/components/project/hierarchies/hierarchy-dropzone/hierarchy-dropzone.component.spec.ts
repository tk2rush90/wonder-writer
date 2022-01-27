import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyDropzoneComponent } from './hierarchy-dropzone.component';

describe('HierarchyDropzoneComponent', () => {
  let component: HierarchyDropzoneComponent;
  let fixture: ComponentFixture<HierarchyDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyDropzoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
