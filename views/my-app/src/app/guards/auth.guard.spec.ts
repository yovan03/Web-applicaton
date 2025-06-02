import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should return true if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect if token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
