import Spy = jasmine.Spy;
export class NativeCommunicationMockBuilder {

  startListeningForEvents: Spy;
  shareInNativeApplication: Spy;
  playInNativeApplication: Spy;
  onLoginError: ((string) => void);
  onLoginSuccess?: (() => void);


  onDelegatedLoginError(onErrorHandler: ((string) => void)) {
    this.onLoginError = onErrorHandler;
  }

  onUserAuthenticated(onAuthenticatedHandler: (() => void)) {
    this.onLoginSuccess = onAuthenticatedHandler;
  }

  build(): NativeCommunicationMockBuilder {
    this.startListeningForEvents = jasmine.createSpy('startListeningForEvents');
    this.shareInNativeApplication = jasmine.createSpy('shareInNativeApplication');
    this.playInNativeApplication = jasmine.createSpy('playInNativeApplication');
    return this;
  }

}
