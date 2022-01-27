import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionItem} from '@tk-ui/models/option-item';

export class RelationActionItem extends OptionItem<string> {
  // Relation editable state
  editable = false;

  constructor(label: string, value: string, editable: boolean) {
    super(label, value);

    this.editable = editable;
  }
}

@Component({
  selector: 'app-relation-view-actions',
  templateUrl: './relation-view-actions.component.html',
  styleUrls: ['./relation-view-actions.component.scss']
})
export class RelationViewActionsComponent implements OnInit {
  // Relation action options
  @Input() options: RelationActionItem[] = [];

  // Selected action change emitter
  @Output() selectedActionChange: EventEmitter<RelationActionItem> = new EventEmitter<RelationActionItem>();

  // Option opened state
  opened = false;

  // Current selected option
  selectedOption!: RelationActionItem;
  /**
   * Set current value
   */
  @Input() selectedAction!: RelationActionItem;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Handle option clicked
   * @param option option
   */
  onOptionClicked(option: RelationActionItem): void {
    if (this.selectedAction !== option) {
      this.selectedActionChange.emit(option);
    }

    this.opened = false;
  }
}
