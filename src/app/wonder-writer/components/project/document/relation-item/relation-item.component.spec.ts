import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationItemComponent } from './relation-item.component';

describe('RelationItemComponent', () => {
  let component: RelationItemComponent;
  let fixture: ComponentFixture<RelationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
