import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { EnvInfoService } from './services/env-info.service';
import { NativeCommunicationService } from './services/native-communication.service';
import { FeaturePolicyBuilder, FeaturePolicy, FeatureContext } from './shared/util/feature-policy';
import { routeToken } from './app.module';

/**
 * The AppComponent is the apps 'container', in which it's child presenters are being displayed.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('logoStateFull', [
      state('collapsed', style({
        marginTop: '-125px'
      })),
      state('full',   style({
        marginTop: '0'
      })),
      transition('collapsed => full', animate('450ms ease-in')),
      transition('full => collapsed', animate('450ms ease-out'))
    ]),
    trigger('transitionInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(450, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(250, style({opacity: 0}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  logoStateFull = true;
  backButtonGoToNativeHome: boolean;
  navigationEnabled: boolean;

  constructor(private nativeService: NativeCommunicationService, private envInfo: EnvInfoService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      const context = new FeatureContext(event.url, this.envInfo.embeddedInWebView, this.envInfo.modal);

      this.backButtonGoToNativeHome = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => (f.enabledWhenEmbedded = true),
        (f: FeaturePolicy) => (f.enabledForPaths = [
          this.asPath(routeToken.root),
          this.asPath(routeToken.home),
          this.asPath(routeToken.login),
          this.asPath(routeToken.create)
        ])
      ]).isEnabled(context, 'backButtonGoToNativeHome');

      this.logoStateFull = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => (f.enabledWhenEmbedded = false),
        (f: FeaturePolicy) => (f.enabledForPaths = [
          this.asPath(routeToken.root),
          this.asPath(routeToken.home),
          this.asPath(routeToken.support)
        ])
      ]).isEnabled(context, 'logoStateFull');

      this.navigationEnabled = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => (f.enabledWhenEmbedded = true),
        (f: FeaturePolicy) => (f.enabledWhenModal = false)
      ]).isEnabled(context, 'navigationEnabled');

    });
  }

  navigateBack() {
    if (this.backButtonGoToNativeHome === true) {
      this.goToNativeHome();
    } else {
      window.history.back();
    }
  }

  navigateHome() {
    if (this.envInfo.embeddedInWebView) {
      if (this.navigationEnabled === true) {
        this.goToNativeHome();
      }
      // do nothing otherwise
    } else {
      this.router.navigateByUrl(this.asPath(routeToken.home));
    }
  }

  private goToNativeHome() {
    this.nativeService.navigateInNativeApplication(this.asPath(routeToken.home));
  }

  private asPath(routeToken: string): string {
    return '/' + routeToken;
  }

}
