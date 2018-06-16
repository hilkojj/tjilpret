import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRecentUserComponent } from './choose-recent-user.component';

describe('ChooseRecentUserComponent', () => {
  let component: ChooseRecentUserComponent;
  let fixture: ComponentFixture<ChooseRecentUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseRecentUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseRecentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
