import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {HierarchyDirectoryType, HierarchyItem} from '../../../../models/hierarchy-item';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HierarchyService} from '../../../../services/common/hierarchy.service';

@Component({
  selector: 'app-hierarchy-item',
  templateUrl: './hierarchy-item.component.html',
  styleUrls: ['./hierarchy-item.component.scss'],
  providers: [
    SubscriptionService,
  ]
})
export class HierarchyItemComponent implements OnInit {
  // Hierarchy data.
  @Input() data!: HierarchyItem;

  // Hierarchy depth.
  @Input() depth = 0;

  // Directory type
  @Input() directoryType!: HierarchyDirectoryType;

  // Hierarchy deleted emitter.
  @Output() hierarchyDeleted: EventEmitter<HierarchyItem> = new EventEmitter<HierarchyItem>();

  // Dragging hierarchy item
  private _draggingHierarchy?: HierarchyItem;

  constructor(
    private hierarchyService: HierarchyService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._subscribeDraggingHierarchy();
  }

  /**
   * Subscribe dragging hierarchy
   */
  private _subscribeDraggingHierarchy(): void {
    const sub = this.hierarchyService
      .draggingHierarchy$
      .subscribe(res => this._draggingHierarchy = res);

    this.subscriptionService.store('_subscribeDraggingHierarchy', sub);
  }

  /**
   * Return `true` when dragging hierarchy is current hierarchy
   * Bind to `ww-dragging` class to hide component
   */
  @HostBinding('class.ww-dragging') get isDragging(): boolean {
    return this._draggingHierarchy?.id === this.data.id;
  }

  /**
   * Remove deleted hierarchy from children.
   * @param hierarchy deleted hierarchy
   */
  onHierarchyDeleted(hierarchy: HierarchyItem): void {
    const index = this.data.children!.findIndex(item => item.id === hierarchy.id);

    if (index !== -1) {
      this.data.children!.splice(index, 1);

      if (this.noChildren) {
        this.data.opened = false;
      }
    }
  }

  /**
   * Return `true` when there is no children.
   */
  get noChildren(): boolean {
    return (this.data.children || []).length === 0;
  }

  /**
   * Return `true` when the hierarchy is not root hierarchy.
   */
  get notRootHierarchy(): boolean {
    return !!this.data.parentId;
  }
}
