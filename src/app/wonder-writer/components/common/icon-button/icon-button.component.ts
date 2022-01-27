import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';

export type IconButtonColor = 'white' | 'suva-grey';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
  // Name of the icon.
  @Input() name?: keyof typeof IconDefinitions;

  // Use preset color scheme for icon button.
  @Input() @HostBinding('attr.ww-color') color: IconButtonColor = 'white';

  constructor() {
  }

  ngOnInit(): void {
  }

}
