import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTextFormComponent } from './single-text-form.component';

describe('SingleTextFormComponent', () => {
  let component: SingleTextFormComponent;
  let fixture: ComponentFixture<SingleTextFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTextFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
