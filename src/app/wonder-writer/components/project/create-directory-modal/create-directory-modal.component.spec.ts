import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectoryModalComponent } from './create-directory-modal.component';

describe('CreateDirectoryModalComponent', () => {
  let component: CreateDirectoryModalComponent;
  let fixture: ComponentFixture<CreateDirectoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDirectoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
