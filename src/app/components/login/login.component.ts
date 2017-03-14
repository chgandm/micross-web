import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirebaseAuthState } from 'angularfire2';
import { EnvInfoService } from '../../services/env-info.service';
import { NativeCommunicationService } from '../../services/native-communication.service';
import { UserService } from '../../services/user.service';


/**
 * This component is quite a bit more complicated than one would assume. This is due to the fact that we allow for the application
 * to run embedded in a Web View within a native app, at which point no actual login is being performed by this component at all.
 *
 * Instead, for this use case (triggered by providing the optional parameter ;embedded=true to the component), the login is being
 * delegated to the host app. This is achieved by
 * 1) handing the user's credentials off to the native host app
 * 2) have the native host log in to the firebase backend
 * 3) have the native host app share the users session data (access token etc) with the Web View
 * 4) saving the session data in the Web Views local storage where firebase will expect it
 * 5) firebase detects the data being available and automatically logs the user in
 *
 * The communication between the native host app and us (running within the Web View) is made possible with the following plugin:
 * https://github.com/shripalsoni04/nativescript-webview-interface
 *
 * Furthermore, based on a parameter passed to the component, the component allows for users to register to Micross.
 *
 */
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  nickname: string;
  email: string;
  password: string;
  loginError = false;
  webViewLogin = false;
  register = false;
  registrationError = false;
  registrationErrorMsg: string;

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private nativeService: NativeCommunicationService,
              private envInfo: EnvInfoService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.webViewLogin = this.envInfo.embeddedInWebView;
    this.register = this.route.snapshot.params['register'] != null;
    this.nativeService.onDelegatedLoginError(() => {
      this.loginError = true;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if (this.register) {
        this.performRegistration();
      } else {
        if (this.webViewLogin) {
          this.nativeService.delegateLoginToNativeApplication(this.email, this.password);
        } else {
          this.performWebLogin();
        }
      }
    }
  }

  toggle() {
    this.register = !this.register;
  }

  private performWebLogin() {
    this.userService.login(this.email, this.password)
      .then(() => {
        this.goToHome();
      })
      .catch((error: Error) => {
        this.loginError = true;
        console.log('An error occurred during the web login: ' + error);
      });
  }

  private performRegistration() {
    this.registrationError = false;
    this.userService.register(this.email, this.password)
      .then((authState: FirebaseAuthState) => {
        // The way we treat errors below brings us into a bad situation in case setting of the nickname fails.
        // However, as there is no functionality available in the application to update the user profile,
        // for now we do not handle it / treat it as a support case, as it should not happen often.
        return this.userService.updateNickname(this.nickname, authState.auth);
      })
      .then(() => {
        this.register = false;
        if (this.webViewLogin) {
          this.nativeService.delegateLoginToNativeApplication(this.email, this.password);
        } else {
          this.goToHome();
        }
      })
      .catch(error => {
        this.registrationError = true;
        if (error.code === 'auth/email-already-in-use') {
          this.registrationErrorMsg = 'An account for this email address already exists.';
        } else {
          this.registrationErrorMsg = 'An unknown error occurred. Please try again.';
        }
        console.log(error);
      });
  }

  private goToHome() {
    this.router.navigateByUrl('/home');
  }
}


