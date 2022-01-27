import {ChangeDetectorRef, Component, ElementRef, OnInit, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {SelectBaseComponent} from '@tk-ui/components/select-base/select-base.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent<T> extends SelectBaseComponent<T> implements OnInit {
  /**
   * override value type from SelectBaseComponent
   */
  override value: T | undefined;

  constructor(
    @Self() @Optional() public override ngControl: NgControl,
    public override elementRef: ElementRef<HTMLElement>,
    protected override changeDetectorRef: ChangeDetectorRef,
  ) {
    super(ngControl, elementRef, changeDetectorRef);
  }

  override ngOnInit(): void {
  }
}
