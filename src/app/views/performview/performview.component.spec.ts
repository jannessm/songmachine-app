import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformviewComponent } from './performview.component';

describe('PerformviewComponent', () => {
  let component: PerformviewComponent;
  let fixture: ComponentFixture<PerformviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
