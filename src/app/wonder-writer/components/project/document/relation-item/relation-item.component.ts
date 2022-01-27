import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-relation-item',
  templateUrl: './relation-item.component.html',
  styleUrls: ['./relation-item.component.scss']
})
export class RelationItemComponent implements OnInit {
  // Name
  @Input() name!: string;

  // Relation
  @Input() relation!: string;

  // Readonly state
  @Input() readOnly = false;

  // Edit click emitter
  @Output() edit: EventEmitter<void> = new EventEmitter<void>();

  // Delete click emitter
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Handle edit click event
   * @param event event
   */
  onEditClick(event: MouseEvent): void {
    EventUtil.neutralize(event);

    this.edit.emit();
  }

  /**
   * Handle delete click event
   * @param event event
   */
  onDeleteClick(event: MouseEvent): void {
    EventUtil.neutralize(event);

    this.delete.emit();
  }
}
