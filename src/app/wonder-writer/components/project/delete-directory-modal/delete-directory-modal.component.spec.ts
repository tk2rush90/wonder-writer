import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDirectoryModalComponent } from './delete-directory-modal.component';

describe('DeleteDirectoryModalComponent', () => {
  let component: DeleteDirectoryModalComponent;
  let fixture: ComponentFixture<DeleteDirectoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDirectoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDirectoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
