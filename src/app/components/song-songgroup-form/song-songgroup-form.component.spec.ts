import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSonggroupFormComponent } from './song-songgroup-form.component';

describe('SongSonggroupFormComponent', () => {
  let component: SongSonggroupFormComponent;
  let fixture: ComponentFixture<SongSonggroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongSonggroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongSonggroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
