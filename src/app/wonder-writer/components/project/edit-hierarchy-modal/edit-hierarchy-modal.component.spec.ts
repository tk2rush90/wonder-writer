import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHierarchyModalComponent } from './edit-hierarchy-modal.component';

describe('EditHierarchyModalComponent', () => {
  let component: EditHierarchyModalComponent;
  let fixture: ComponentFixture<EditHierarchyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHierarchyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHierarchyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
