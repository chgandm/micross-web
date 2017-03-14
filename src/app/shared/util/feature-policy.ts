import { isNullOrUndefined } from 'util';
/**
 * This set of classes allows to fluently enable features depending on the current context:
 *
 * ```
 *  const context = FeatureContext(...)
 *
 *  const enabled = FeaturePolicyBuilder.build([
 *    (f: FeaturePolicy) => (f.enabledWhenEmbedded = true),
 *    (f: FeaturePolicy) => (f.enabledForPaths = ['/some', '/paths'])
 *  ]).isEnabled(context);
 * ```
 * If any of the feature properties are left undefined, an arbitrary context will match.
 */
export class FeaturePolicy {

  enabledWhenEmbedded: boolean;
  enabledWhenModal: boolean;
  enabledForPaths: string[] = [];

  constructor() { }

  public isEnabled(context: FeatureContext, feature?: string) {
    let enabled = true;
    if (!isNullOrUndefined(this.enabledWhenEmbedded)) {
      enabled = enabled && (this.enabledWhenEmbedded === context.embedded);
    }
    if (!isNullOrUndefined(this.enabledWhenModal)) {
      enabled = enabled && (this.enabledWhenModal === context.modal);
    }
    if (this.enabledForPaths.length > 0) {
      enabled = enabled && this.isFeatureEnabledForPath(context.url, this.enabledForPaths);
    }
    console.log(feature + ' enabled: ' + enabled);
    return enabled;
  }

  private isFeatureEnabledForPath(contextPath: string, enabledPaths: string[]) {
    let enabled = false;
    const semiColonIdx = contextPath.indexOf(';');
    if (semiColonIdx > 0) {
      contextPath = contextPath.substr(0, semiColonIdx);
    }
    enabledPaths.forEach(path => {
      if (contextPath === path) {
        enabled = true;
      }
    });
    return enabled;
  }

}

export class FeaturePolicyBuilder {
  static build(featurePolicySetter: ((FeaturePolicy) => void)[]): FeaturePolicy {
    const featurePolicy = new FeaturePolicy();
    featurePolicySetter.forEach(setOn => {
      setOn(featurePolicy);
    });
    return featurePolicy;
  }
}

export class FeatureContext {
  constructor(public url: string, public embedded: boolean, public modal: boolean) {

  }
}
