import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class NativeCommunicationService {
  private listening = false;
  private onLoginError: ((string) => void);
  private onLoginSuccess?: (() => void);

  public startListeningForEvents() {
    // setup a listener for the delegated login
    if (!this.listening) {
      this.listening = true;
      console.log('Started listening for native events...');
      window['nsWebViewInterface']['on']('nativeLoginResult', (loginResult: DelegatedLoginResult) => {
        this.acceptDelegatedLogin(loginResult);
      });
    }
  }

  public onDelegatedLoginError(onErrorHandler: ((string) => void)) {
    this.onLoginError = onErrorHandler;
  }

  public onUserAuthenticated(onAuthenticatedHandler: (() => void)) {
    this.onLoginSuccess = onAuthenticatedHandler;
  }

  public delegateLoginToNativeApplication(email: string, password: string) {
    window['nsWebViewInterface']['emit']('credentials', {
      email: email,
      password: password
    });
  }

  public shareInNativeApplication(message: string) {
    window['nsWebViewInterface']['emit']('share', {
      msg: message
    });
  }

  public navigateInNativeApplication(page: string) {
    window['nsWebViewInterface']['emit']('navigate', {
      navigationToken: page
    });
  }

  public playInNativeApplication(puzzleId: string, puzzleSize: string) {
    window['nsWebViewInterface']['emit']('play', {
      puzzleId: puzzleId,
      puzzleSize: puzzleSize
    });
  }

  private acceptDelegatedLogin(result: DelegatedLoginResult) {
    console.log('Received a delegated login result from the native app.');
    if (result.error) {
      if (this.onLoginError !== undefined) {
        this.onLoginError(result.msg);
      }
      console.log('An error occurred during login delegation: ' + result.msg);
    } else {
      const sessionData = this.buildSessionDataForLocalStorage(result);
      localStorage.setItem(`firebase:authUser:${environment.firebaseConfig.apiKey}:[DEFAULT]`, JSON.stringify(sessionData));
      if (this.onLoginSuccess !== undefined) {
        this.onLoginSuccess();
      }
      window['nsWebViewInterface']['emit']('weblogin', {
        success: true
      });
    }
  }

  private jwt_decode (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  private buildSessionDataForLocalStorage(result: DelegatedLoginResult) {
    const session = result.session;
    return {
      uid: session.uid,
      displayName: session.displayName,
      photoURL: session.photoURL,
      email: session.email,
      emailVerified: session.emailVerified,
      isAnonymous: session.isAnonymous,
      providerData: [{
        uid: session.uid,
        displayName: session.displayName,
        photoURL: session.photoURL,
        email: session.email,
        providerId: 'password'
      }],
      apiKey: environment.firebaseConfig.apiKey,
      appName: '[DEFAULT]',
      authDomain: environment.firebaseConfig.authDomain,
      stsTokenManager: {
        apiKey: environment.firebaseConfig.apiKey,
        refreshToken: session.refreshToken,
        accessToken: session.accessToken,
        // the expiration time in the 'cookie' is in ms, whereas the token contains it in seconds
        expirationTime: this.jwt_decode(session.accessToken).exp + '000',
      },
      redirectEventId: null
    };
  }

}

interface DelegatedLoginResult {
  error: true;
  msg: string;

  session: {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    refreshToken: string;
    accessToken: string;
    expirationTime: string;
  };
}
