/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { EnvInfoService } from './env-info.service';
import { UserService } from './user.service';
import { UserServiceMockBuilder } from '../../testutil/user-service-mock-builder';
import { constants } from '../../testutil/constants';

describe('EnvInfoService', () => {
  let envService: EnvInfoService;
  let userService: UserServiceMockBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvInfoService,
        { provide: UserService, useValue: new UserServiceMockBuilder().build() }
      ]
    });
    envService = TestBed.get(EnvInfoService);
    userService = TestBed.get(UserService);
  });

  it('should create', () => {
    expect(envService).toBeTruthy();
  });

  describe('for logged in users', () => {

    beforeEach(() => {
      userService.setDefaultUserInfo(true).build();
    });

    it('returns the correct user information', (done) => {
      envService.getUser().first().subscribe(user => {
        expect(user).not.toBeNull();
        expect(user.uid).toEqual(constants.uid);
        expect(user.loggedIn).toBeTruthy();
        done();
      });
    });

  });

  describe('for logged out users', () => {

    beforeEach(() => {
      userService.setDefaultUserInfo(false).build();
    });

    it('returns the correct user information', (done) => {
      envService.getUser().first().subscribe(user => {
        expect(user).not.toBeNull();
        expect(user.uid).toEqual(constants.uid);
        expect(user.loggedIn).toBeFalsy();
        done();
      });
    });

  });

});
