import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

/**
 * Implementation according to https://goo.gl/gj0kQW.
 * Usage:
 *
 * <form>
 *     ...
 *     <input type="text" validateEmail />
 *     ...
 * </form>
 */
@Directive({
  selector: '[validEmail][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EmailValidatorDirective), multi: true }
  ]
})
export class EmailValidatorDirective implements Validator {

  validate(c: FormControl): { [error: string]: any } {
    const emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    return emailRegexp.test(c.value) ? null : {
        validEmail: {
          valid: false
        }
      };
  }


}

