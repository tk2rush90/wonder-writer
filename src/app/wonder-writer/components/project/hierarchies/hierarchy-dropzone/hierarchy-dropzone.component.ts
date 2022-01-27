import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {DroppableEvent, HierarchyService} from '../../../../services/common/hierarchy.service';
import {MathUtil} from '@tk-ui/utils/math.util';
import {DroppableItem} from '../droppable/droppable-item';
import {HierarchyDirectoryType, HierarchyItem} from '../../../../models/hierarchy-item';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-hierarchy-dropzone',
  templateUrl: './hierarchy-dropzone.component.html',
  styleUrls: ['./hierarchy-dropzone.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class HierarchyDropzoneComponent extends DroppableItem implements OnInit, AfterViewInit, OnDestroy {
  // Next hierarchy item
  @Input() data!: HierarchyItem;

  // Hierarchy depth.
  @Input() depth = 0;

  // Root hierarchy type.
  @Input() directoryType!: HierarchyDirectoryType;

  constructor(
    protected override elementRef: ElementRef<HTMLElement>,
    protected override hierarchyService: HierarchyService,
    protected override subscriptionService: SubscriptionService,
  ) {
    super(
      elementRef,
      hierarchyService,
      subscriptionService,
    );
  }

  /**
   * Return droppable event
   */
  get droppableEvent(): DroppableEvent {
    return {
      parentId: this.data.parentId as string,
      nextId: this.data.id,
    };
  }

  /**
   * Bind left padding with `depth` value.
   */
  @HostBinding('style.padding-left') get paddingLeft(): string {
    return `${(this.depth + 1) * 21 + 10}px`;
  }

  ngOnInit(): void {
    this._subscribeDraggingHierarchy();
    this._subscribeDraggingScope();
  }

  ngAfterViewInit(): void {
    this.hierarchyService.registerDroppableDropzone(this);
  }

  ngOnDestroy(): void {
    this.hierarchyService.unregisterDroppableDropzone(this);
  }

  /**
   * Check the dragging hierarchy position whether
   * this component contains dragging hierarchy or not
   * @param event mouse event
   * @param draggingDOMRect dragging hierarchy DOMRect
   */
  override checkDraggingHierarchyContained(event: MouseEvent | TouchEvent, draggingDOMRect: DOMRect): void {
    if (this._draggingScope === this.directoryType) {
      const domRect = this.element.getBoundingClientRect();
      const {x, y} = EventUtil.getMouseOrTouchXY(event);

      const rect = {
        x: x - draggingDOMRect.width / 2,
        y: y - draggingDOMRect.height / 2,
        width: draggingDOMRect.width,
        height: draggingDOMRect.height / 2,
      };

      const horizontal = MathUtil.rectHorizontallyOverlapsRect(domRect, rect) || MathUtil.rectHorizontallyOverlapsRect(rect, domRect);
      const vertical = MathUtil.rectVerticallyContainsRect(rect, domRect);

      this.droppable = horizontal && vertical;
    }
  }
}
