import { TestBed } from '@angular/core/testing';

import { AuthentcationService } from './authentcation.service';

describe('AuthentcationService', () => {
  let service: AuthentcationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentcationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
