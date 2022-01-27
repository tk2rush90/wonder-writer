import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHierarchyModalComponent } from './delete-hierarchy-modal.component';

describe('DeleteHierarchyModalComponent', () => {
  let component: DeleteHierarchyModalComponent;
  let fixture: ComponentFixture<DeleteHierarchyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHierarchyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHierarchyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
