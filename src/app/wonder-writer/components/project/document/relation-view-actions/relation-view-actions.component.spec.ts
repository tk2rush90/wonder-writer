import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationViewActionsComponent } from './relation-view-actions.component';

describe('RelationViewActionsComponent', () => {
  let component: RelationViewActionsComponent;
  let fixture: ComponentFixture<RelationViewActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationViewActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationViewActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
