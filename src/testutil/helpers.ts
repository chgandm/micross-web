import { DebugElement } from '@angular/core';
import { EnvInfoService } from '../app/services/env-info.service';
import { EnvInfoMockBuilder } from './env-info-mock-builder';
import { NativeCommunicationService } from '../app/services/native-communication.service';
import { NativeCommunicationMockBuilder } from './native-communication-mock-builder';
import { UserService } from '../app/services/user.service';
import { UserServiceMockBuilder } from './user-service-mock-builder';

/**
 * These baseProviders are meant to keep the actual Specs DRY. They
 * - can be easily appended to any Testbed configuration using ...baseProviders
 * - can be manipulated by calling any of the set*-methods (with a subsequent call to build to 'lock' the mock).
 */
export const baseProviders = [
  { provide: EnvInfoService, useValue: new EnvInfoMockBuilder().setWebDefaults(true).build() },
  { provide: NativeCommunicationService, useValue: new NativeCommunicationMockBuilder().build() },
  { provide: UserService, useValue: new UserServiceMockBuilder().build() }
];

export const ButtonClickEvents = {
  left:  { button: 0 },
  right: { button: 2 }
};

/**
 * Simulate element click.
 * Defaults to mouse left-button click event.
 *
 */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

/**
 * Inputs a value into an HTML input element and notifies Angular.
 */
export function inputValue(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input'));
}
