import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubmedComponent } from './pubmed.component';

describe('PubmedComponent', () => {
  let component: PubmedComponent;
  let fixture: ComponentFixture<PubmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
