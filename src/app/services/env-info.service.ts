import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { MicrossUser } from '../shared/dom/micross-user';

@Injectable()
export class EnvInfoService {

  public debug = !environment.production;
  public embeddedInWebView;
  public modal;

  constructor(private userService: UserService) { }

  public getUser(): Observable<MicrossUser> {
    return this.userService.getUser();
  }

  public setEmbeddedInWebViewOnce(val: boolean) {
    if (this.embeddedInWebView == null) {
      this.embeddedInWebView = val;
    }
  }

  public setModalOnce(val: boolean) {
    if (this.modal == null) {
      this.modal = val;
    }
  }

  public allEnvInfoAvailable(): boolean {
    return this.embeddedInWebView && this.modal;
  }
}
