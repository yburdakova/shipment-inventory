import { TestBed } from '@angular/core/testing';

import { BoxedService } from './boxed.service';

describe('BoxedService', () => {
  let service: BoxedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
