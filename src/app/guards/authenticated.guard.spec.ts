/* tslint:disable:no-unused-variable */
import { AuthenticatedGuard } from './authenticated.guard';
import { UserService } from '../services/user.service';
import { UserServiceMockBuilder } from '../../testutil/user-service-mock-builder';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard;
  let userMock: UserServiceMockBuilder;
  let navSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:    [
        AuthenticatedGuard,
        { provide: UserService, useValue: new UserServiceMockBuilder().build() }
      ],
      imports: [ RouterTestingModule.withRoutes([]) ]
    });
    guard = TestBed.get(AuthenticatedGuard);
    userMock = TestBed.get(UserService);
    navSpy = spyOn(TestBed.get(Router), 'navigate');
  });


  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('for logged in users', () => {
    beforeEach(() => {
      userMock.setDefaultUserInfo(true).build();
    });

    it('should activate', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(canActivate).toBeTruthy();
        done();
      });
    });
  });

  describe('for logged out users', () => {
    beforeEach(() => {
      userMock.setDefaultUserInfo(false).build();
    });

    it('should NOT activate', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(canActivate).toBeFalsy();
        done();
      });
    });

    it('should instead route away', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(navSpy.calls.any()).toBe(true, 'router.navigate called');
        done();
      });
    });
  });

});
