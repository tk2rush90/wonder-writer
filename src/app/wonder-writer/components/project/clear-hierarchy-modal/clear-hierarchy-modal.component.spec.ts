import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearHierarchyModalComponent } from './clear-hierarchy-modal.component';

describe('ClearHierarchyModalComponent', () => {
  let component: ClearHierarchyModalComponent;
  let fixture: ComponentFixture<ClearHierarchyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearHierarchyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearHierarchyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
