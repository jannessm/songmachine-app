import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceWrapperComponent } from './ace-wrapper.component';

describe('AceWrapperComponent', () => {
  let component: AceWrapperComponent;
  let fixture: ComponentFixture<AceWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
