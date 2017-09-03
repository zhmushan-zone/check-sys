import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCheckComponent } from './manage-check.component';

describe('ManageCheckComponent', () => {
  let component: ManageCheckComponent;
  let fixture: ComponentFixture<ManageCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
