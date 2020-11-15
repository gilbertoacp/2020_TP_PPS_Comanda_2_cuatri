import { TestBed } from '@angular/core/testing';

import { DuenioGuard } from './duenio.guard';

describe('DuenioGuard', () => {
  let guard: DuenioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DuenioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
