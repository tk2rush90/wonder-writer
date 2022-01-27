import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentHierarchyComponent } from './current-hierarchy.component';

describe('CurrentHierarchyComponent', () => {
  let component: CurrentHierarchyComponent;
  let fixture: ComponentFixture<CurrentHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
