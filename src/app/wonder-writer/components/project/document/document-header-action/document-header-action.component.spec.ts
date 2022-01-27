import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentHeaderActionComponent } from './document-header-action.component';

describe('DocumentHeaderActionComponent', () => {
  let component: DocumentHeaderActionComponent;
  let fixture: ComponentFixture<DocumentHeaderActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentHeaderActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentHeaderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
