import { TestBed } from '@angular/core/testing';

import { PubmedService } from './pubmed.service';

describe('PubmedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PubmedService = TestBed.get(PubmedService);
    expect(service).toBeTruthy();
  });
});
