import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {HierarchyItem} from '../../../../models/hierarchy-item';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HierarchyService} from '../../../../services/common/hierarchy.service';

@Component({
  selector: 'app-dragging-hierarchy',
  templateUrl: './dragging-hierarchy.component.html',
  styleUrls: ['./dragging-hierarchy.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class DraggingHierarchyComponent implements OnInit, AfterViewInit, OnDestroy {
  // Dragging hierarchy data
  @Input() data!: HierarchyItem;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private hierarchyService: HierarchyService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._setDraggingHierarchyDOMRect();
  }

  ngOnDestroy(): void {
    this._unsetDraggingHierarchyDOMRect();
  }

  /**
   * Return host element
   */
  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /**
   * Set dragging hierarchy component DOMRect
   */
  private _setDraggingHierarchyDOMRect(): void {
    this.hierarchyService.draggingHierarchyDOMRect = this.element.getBoundingClientRect();
  }

  /**
   * Unset dragging hierarchy component DOMRect
   */
  private _unsetDraggingHierarchyDOMRect(): void {
    this.hierarchyService.draggingHierarchyDOMRect = undefined;
  }
}
