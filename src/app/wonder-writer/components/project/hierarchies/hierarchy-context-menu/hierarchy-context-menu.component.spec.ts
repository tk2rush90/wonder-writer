import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyContextMenuComponent } from './hierarchy-context-menu.component';

describe('HierarchyContextMenuComponent', () => {
  let component: HierarchyContextMenuComponent;
  let fixture: ComponentFixture<HierarchyContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
