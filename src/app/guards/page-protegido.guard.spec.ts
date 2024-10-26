import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pageProtegidoGuard } from './page-protegido.guard';

describe('pageProtegidoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pageProtegidoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
