import { Observable } from 'rxjs/Observable';
import { MicrossUser } from '../app/shared/dom/micross-user';
import { constants } from './constants';

export class EnvInfoMockBuilder {
  user: MicrossUser;

  setWebDefaults(loggedIn: boolean): EnvInfoMockBuilder {
    this.setEmbeddedInWebView(false);
    this.setModal(false);
    this.setUserDefaults(loggedIn);
    return this;
  }

  setMobileDefaults(loggedIn: boolean): EnvInfoMockBuilder {
    this.setEmbeddedInWebView(true);
    this.setModal(false);
    this.setUserDefaults(loggedIn);
    return this;
  }

  setUserDefaults(loggedIn: boolean): EnvInfoMockBuilder {
    return this.setUserInfo(constants.uid, constants.mail, constants.nickname, loggedIn);
  }

  setEmbeddedInWebView(embedded: boolean): EnvInfoMockBuilder {
    this['embeddedInWebView'] = embedded;
    return this;
  }

  setModal(embedded: boolean): EnvInfoMockBuilder {
    this['modal'] = embedded;
    return this;
  }

  setUserInfo(uid: string, email: string, nickname: string, loggedIn: boolean): EnvInfoMockBuilder {
    this.user = new MicrossUser(loggedIn);
    this.user.uid = uid;
    this.user.email = email;
    this.user.nickname = nickname;
    return this;
  }


  build(): EnvInfoMockBuilder {
    this['allEnvInfoAvailable'] = jasmine.createSpy('allEnvInfoAvailable'); // tbd
    this['getUser'] = jasmine.createSpy('getUser').and.returnValue(Observable.of(this.user));
    return this;
  }

}
