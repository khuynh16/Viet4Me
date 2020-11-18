import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameCategoryComponent } from './rename-category.component';

describe('RenameCategoryComponent', () => {
  let component: RenameCategoryComponent;
  let fixture: ComponentFixture<RenameCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
