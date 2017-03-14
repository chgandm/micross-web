/* tslint:disable:no-unused-variable */

import { FeatureContext, FeaturePolicy, FeaturePolicyBuilder } from './feature-policy';

describe('FeaturePolicy', () => {
  let policy: FeaturePolicy;

  describe('when fully defined', () => {
    beforeEach(() => {
      policy = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => f.enabledForPaths = ['/path'],
        (f: FeaturePolicy) => f.enabledWhenEmbedded = true,
        (f: FeaturePolicy) => f.enabledWhenModal = true
      ]);
    });

    it('all properties need to match', () => {
      expect(policy.isEnabled(new FeatureContext('/path', true, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, true))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', true, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', false, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/anotherPath', true, true))).toBeFalsy();
    });
  });

  describe('with the path property left undefined', () => {
    beforeEach(() => {
      policy = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => f.enabledWhenEmbedded = true,
        (f: FeaturePolicy) => f.enabledWhenModal = true
      ]);
    });

    it('any path will match', () => {
      expect(policy.isEnabled(new FeatureContext('/path', true, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, true))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', true, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', false, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/anotherPath', true, true))).toBeTruthy();
    });
  });

  describe('with the embedded property left undefined', () => {
    beforeEach(() => {
      policy = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => f.enabledWhenModal = true
      ]);
    });

    it('an arbitrary embedded state will match', () => {
      expect(policy.isEnabled(new FeatureContext('/path', true, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', true, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', false, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/anotherPath', true, true))).toBeTruthy();
    });
  });

  describe('with the modal property left undefined', () => {
    beforeEach(() => {
      policy = FeaturePolicyBuilder.build([
        (f: FeaturePolicy) => f.enabledWhenEmbedded = true
      ]);
    });

    it('an arbitrary modal state will match', () => {
      expect(policy.isEnabled(new FeatureContext('/path', true, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, true))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/path', true, false))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, false))).toBeFalsy();
      expect(policy.isEnabled(new FeatureContext('/anotherPath', true, true))).toBeTruthy();
    });
  });

  describe('with no properties defined', () => {
    beforeEach(() => {
      policy = FeaturePolicyBuilder.build([]);
    });

    it('anything goes', () => {
      expect(policy.isEnabled(new FeatureContext('/path', true, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, true))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', true, false))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/path', false, false))).toBeTruthy();
      expect(policy.isEnabled(new FeatureContext('/anotherPath', true, true))).toBeTruthy();
    });
  });

});
