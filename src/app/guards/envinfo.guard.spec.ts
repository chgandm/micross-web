/* tslint:disable:no-unused-variable */
import { UserService } from '../services/user.service';
import { TestBed } from '@angular/core/testing';
import { EnvInfoGuard } from './envinfo.guard';
import { EnvInfoService } from '../services/env-info.service';
import { NativeCommunicationMockBuilder } from '../../testutil/native-communication-mock-builder';
import { NativeCommunicationService } from '../services/native-communication.service';
import { UserServiceMockBuilder } from '../../testutil/user-service-mock-builder';

describe('EnvInfoGuard', () => {
  let guard: EnvInfoGuard;
  let envInfoService: EnvInfoService;
  let nativeCommMock: NativeCommunicationMockBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:    [
        EnvInfoGuard, EnvInfoService,
        { provide: NativeCommunicationService, useValue: new NativeCommunicationMockBuilder().build() },
        { provide: UserService, useValue: new UserServiceMockBuilder().build() }
      ]
    });
    guard = TestBed.get(EnvInfoGuard);
    envInfoService = TestBed.get(EnvInfoService);
    nativeCommMock = TestBed.get(NativeCommunicationService);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should set the env info', () => {
    guard.canActivate(null, { url: '/some/path;embedded=true;modal=true', root: null });
    expect(envInfoService.embeddedInWebView).toBeTruthy();
    expect(envInfoService.modal).toBeTruthy();
  });

  it('should start listening for native events in embedded mode', () => {
    guard.canActivate(null, { url: '/some/path;embedded=true', root: null });
    expect(nativeCommMock.startListeningForEvents.calls.any()).toBe(true, 'started listening');
  });

  it('should NOT start listening for native events web mode', () => {
    guard.canActivate(null, { url: '/some/path', root: null });
    expect(nativeCommMock.startListeningForEvents.calls.any()).toBe(false, 'did not start listening');
  });
});
