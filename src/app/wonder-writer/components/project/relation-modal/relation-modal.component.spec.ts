import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RelationModalComponent} from './relation-modal.component';

describe('CreateRelationModalComponent', () => {
  let component: RelationModalComponent;
  let fixture: ComponentFixture<RelationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelationModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
