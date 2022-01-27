import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHierarchyModalComponent } from './create-hierarchy-modal.component';

describe('CreateHierarchyModalComponent', () => {
  let component: CreateHierarchyModalComponent;
  let fixture: ComponentFixture<CreateHierarchyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateHierarchyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHierarchyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
