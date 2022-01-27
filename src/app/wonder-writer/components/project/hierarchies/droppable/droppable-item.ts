import {Directive, ElementRef, HostBinding} from '@angular/core';
import {HierarchyService} from '../../../../services/common/hierarchy.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HierarchyDirectoryType} from '../../../../models/hierarchy-item';

@Directive({
  selector: '[appDroppableItem]'
})
export class DroppableItem {
  // Bind droppable state to droppable class
  // It should be worked only for directory type
  @HostBinding('class.ww-droppable') droppable = false;

  // Dragging scope
  protected _draggingScope?: HierarchyDirectoryType;

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected hierarchyService: HierarchyService,
    protected subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Return host element
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Check the dragging hierarchy position whether
   * This should be overridden
   * this component contains dragging hierarchy or not
   * @param event mouseevent
   * @param draggingDOMRect dragging hierarchy dom rect
   */
  checkDraggingHierarchyContained(event: MouseEvent, draggingDOMRect: DOMRect): void {
    throw new Error(`'_checkDraggingHierarchyContained()' method should be overridden`);
  }

  /**
   * Subscribe dragging hierarchy
   */
  protected _subscribeDraggingHierarchy(): void {
    const sub = this.hierarchyService
      .draggingHierarchy$
      .subscribe(res => {
        if (!res) {
          this.droppable = false;
        }
      });

    this.subscriptionService.store('_subscribeDraggingHierarchy', sub);
  }

  /**
   * Subscribe dragging scope
   */
  protected _subscribeDraggingScope(): void {
    const sub = this.hierarchyService
      .draggingScope$
      .subscribe(res => this._draggingScope = res);

    this.subscriptionService.store('_subscribeDraggingScope', sub);
  }
}
