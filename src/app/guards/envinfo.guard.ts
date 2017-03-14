import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { EnvInfoService } from '../services/env-info.service';
import { NativeCommunicationService } from '../services/native-communication.service';

/**
 * Ensures that essential environment variables used throughout the application  are set appropriately.
 * If necessary the application starts listening to native events.
 */
@Injectable()
export class EnvInfoGuard implements CanActivate {

  constructor(private nativeService: NativeCommunicationService, private envInfo: EnvInfoService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('EnvInfoGuard#canActivate called');
    if (this.envInfo.allEnvInfoAvailable()) {
      console.log('Using available env info');
      return true;
    }
    const url = state.url;
    this.envInfo.setEmbeddedInWebViewOnce(url.includes(';embedded=true'));
    this.envInfo.setModalOnce(url.includes(';modal=true'));
    if (this.envInfo.embeddedInWebView === true) {
      this.nativeService.startListeningForEvents();
    }
    return true;
  }

}
