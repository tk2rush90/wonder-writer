import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLogoComponent } from './project-logo.component';

describe('ProjectLogoComponent', () => {
  let component: ProjectLogoComponent;
  let fixture: ComponentFixture<ProjectLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
