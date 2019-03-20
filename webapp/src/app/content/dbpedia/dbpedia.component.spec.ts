import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbpediaComponent } from './dbpedia.component';

describe('DbpediaComponent', () => {
  let component: DbpediaComponent;
  let fixture: ComponentFixture<DbpediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbpediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbpediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
