import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggingHierarchyComponent } from './dragging-hierarchy.component';

describe('DraggingHierarchyComponent', () => {
  let component: DraggingHierarchyComponent;
  let fixture: ComponentFixture<DraggingHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraggingHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggingHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
