import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

export class DocumentAction {
  // Icon name
  name: keyof typeof IconDefinitions;

  // Click handler
  // `action` is current `DocumentAction`
  clickHandler: (action: DocumentAction) => void;

  // Active state
  private _active = false;

  // Action disabled state
  private _disabled = false;

  constructor(name: keyof typeof IconDefinitions, clickHandler: (action: DocumentAction) => void) {
    this.name = name;
    this.clickHandler = clickHandler;
  }

  /**
   * Get active state
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * Set active state
   * @param state state
   */
  set active(state: boolean) {
    this._active = state;
  }

  /**
   * Get disabled state
   */
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set disabled state
   * @param state state
   */
  set disabled(state: boolean) {
    this._disabled = state;
  }
}

@Component({
  selector: 'app-document-header-action',
  templateUrl: './document-header-action.component.html',
  styleUrls: ['./document-header-action.component.scss']
})
export class DocumentHeaderActionComponent implements OnInit {
  // Header action data
  @Input() data!: DocumentAction;

  // Global action disabled state
  @Input() disabled = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Get button active state and bind to active class
   */
  @HostBinding('class.ww-active') get active(): boolean {
    return this.data.active;
  }

  /**
   * Get global or current action disabled state and bind to disabled class
   */
  @HostBinding('class.ww-disabled') get actionDisabled(): boolean {
    return this.disabled || this.data.disabled;
  }

  /**
   * call click handler
   */
  @HostListener('click')
  onHostClick(): void {
    this.data.clickHandler(this.data);
  }
}
