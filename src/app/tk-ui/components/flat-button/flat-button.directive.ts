import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[appFlatButton]'
})
export class FlatButtonDirective {
  /**
   * set and bind color attribute
   */
  @Input() @HostBinding('attr.tk-color') color: FlatButtonColor = 'bright-grey';

  /**
   * bind base class
   */
  @HostBinding('class.tk-flat-button') baseClass = true;

  constructor() {
  }
}

/**
 * button color type
 */
export type FlatButtonColor = 'bright-grey' | 'chestnut' | 'wild-blue-yonder';
