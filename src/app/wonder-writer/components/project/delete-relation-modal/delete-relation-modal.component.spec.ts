import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRelationModalComponent } from './delete-relation-modal.component';

describe('DeleteRelationModalComponent', () => {
  let component: DeleteRelationModalComponent;
  let fixture: ComponentFixture<DeleteRelationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRelationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRelationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
