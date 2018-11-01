import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SonggroupComponent } from './songgroup.component';

describe('SonggroupComponent', () => {
  let component: SonggroupComponent;
  let fixture: ComponentFixture<SonggroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonggroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SonggroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
