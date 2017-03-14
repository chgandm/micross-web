import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NativeCommunicationService } from '../services/native-communication.service';
import { EnvInfoService } from '../services/env-info.service';

/**
 * This guard ensures that a native host application has enough time to inject authentication/session data
 * into the WebView before e.g. the AuthenticatedGuard (further down the chain) checks if the user has the necessary
 * privileges to open the requested page.
 */
@Injectable()
export class EmbeddedAuthenticatedGuard implements CanActivate {

  constructor(private envService: EnvInfoService, private nativeService: NativeCommunicationService) {

  }

  canActivate(): Observable<boolean> {
    console.log('EmbeddedAuthenticatedGuard#canActivate called');
    if (this.envService.embeddedInWebView) {
      return new Observable<boolean>((observer: any) => {
        this.nativeService.onUserAuthenticated(() => {
          return observer.next(true);
        });
        this.nativeService.onDelegatedLoginError(() => {
          return observer.next(false);
        });
        setTimeout(() => {
          console.log('did not receive a response by the native application in time, continuing anyway');
          observer.next(true);
        }, 1000);
      });
    } else {
      return Observable.of(true);
    }
  }

}
