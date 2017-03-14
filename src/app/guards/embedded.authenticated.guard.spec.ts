/* tslint:disable:no-unused-variable */
import { UserService } from '../services/user.service';
import { UserServiceMockBuilder } from '../../testutil/user-service-mock-builder';
import { TestBed } from '@angular/core/testing';
import { EmbeddedAuthenticatedGuard } from './embedded.authenticated.guard';
import { EnvInfoService } from '../services/env-info.service';
import { EnvInfoMockBuilder } from '../../testutil/env-info-mock-builder';
import { NativeCommunicationMockBuilder } from '../../testutil/native-communication-mock-builder';
import { NativeCommunicationService } from '../services/native-communication.service';

describe('EmbeddedAuthenticatedGuard', () => {
  let guard: EmbeddedAuthenticatedGuard;
  let envInfoMock: EnvInfoMockBuilder;
  let nativeCommMock: NativeCommunicationMockBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:    [
        EmbeddedAuthenticatedGuard, EnvInfoService,
        { provide: EnvInfoService, useValue: new EnvInfoMockBuilder().build() },
        { provide: NativeCommunicationService, useValue: new NativeCommunicationMockBuilder().build() },
        { provide: UserService, useValue: new UserServiceMockBuilder().build() }
      ]
    });
    guard = TestBed.get(EmbeddedAuthenticatedGuard);
    envInfoMock = TestBed.get(EnvInfoService);
    nativeCommMock = TestBed.get(NativeCommunicationService);
  });


  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('activates when not embedded', (done) => {
    envInfoMock.setEmbeddedInWebView(false);
    guard.canActivate().first().subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  describe('when embedded', () => {
    beforeEach(() => {
      envInfoMock.setEmbeddedInWebView(true);
    });

    it('activates eventually (without a native response)', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(canActivate).toBe(true);
        done();
      });
    });

    it('activates for successful native responses', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(canActivate).toBe(true);
        done();
      });
      nativeCommMock.onLoginSuccess();
    });

    it('activates NOT for unsuccessful native responses', (done) => {
      guard.canActivate().first().subscribe(canActivate => {
        expect(canActivate).toBe(false);
        done();
      });
      nativeCommMock.onLoginError('error');
    });
  });


});
