import { TestBed } from '@angular/core/testing';

import { CaseSearchService } from './case-search.service';

describe('CaseSearchService', () => {
  let service: CaseSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
