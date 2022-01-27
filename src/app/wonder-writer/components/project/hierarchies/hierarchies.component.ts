import {ChangeDetectorRef, Component, HostBinding, HostListener, OnDestroy, OnInit} from '@angular/core';
import {HierarchyStoreService} from '../../../services/db/hierarchy-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, finalize, from} from 'rxjs';
import {HierarchyItem} from '../../../models/hierarchy-item';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';
import {DroppableEvent, HierarchyService} from '../../../services/common/hierarchy.service';
import {HierarchyUtil} from '../../../utils/hierarchy.util';
import {EventListenerService} from '../../../services/others/event-listener.service';
import {EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-hierarchies',
  templateUrl: './hierarchies.component.html',
  styleUrls: ['./hierarchies.component.scss'],
  providers: [
    SubscriptionService,
    EventListenerService,
  ],
})
export class HierarchiesComponent implements OnInit, OnDestroy {
  // hierarchies
  hierarchies: HierarchyItem[] = [];

  // Dragging hierarchy
  draggingHierarchy?: HierarchyItem;
  // Hierarchy drawer opened state
  @HostBinding('class.ww-opened') opened = false;
  // Project id.
  private _projectId: string | null = null;
  // Opened document hierarchy
  private _openedHierarchy?: HierarchyItem;
  // Droppable event
  private _droppableEvent?: DroppableEvent;
  // Dragging mouse event
  private _draggingMouseEvent?: MouseEvent | TouchEvent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private eventListenerService: EventListenerService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyService: HierarchyService,
    private hierarchyStoreService: HierarchyStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Return dragging hierarchy left style
   */
  get draggingHierarchyLeft(): string {
    const {x} = EventUtil.getMouseOrTouchXY(this._draggingMouseEvent);

    return (x || 0) + 'px';
  }

  /**
   * Return dragging hierarchy top style
   */
  get draggingHierarchyTop(): string {
    const {y} = EventUtil.getMouseOrTouchXY(this._draggingMouseEvent);

    return (y || 0) + 'px';
  }

  /**
   * Return dragging state and bind to dragging class
   */
  @HostBinding('class.ww-dragging') get dragging(): boolean {
    return !!this.draggingHierarchy;
  }

  ngOnInit(): void {
    this._checkBrowserWidth();

    this._subscribeHierarchyDrawerOpened();
    this._subscribeOpenedHierarchy();
    this._subscribeActivatedRouteParams();
    this._subscribeDraggingHierarchy();
    this._subscribeDraggingPositions();
  }

  ngOnDestroy(): void {
    this.hierarchyService.hierarchyDrawerOpened = false;
  }

  /**
   * Listen window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._checkBrowserWidth();
  }

  /**
   * Subscribe hierarchy drawer opened state
   */
  private _subscribeHierarchyDrawerOpened(): void {
    const sub = this.hierarchyService
      .hierarchyDrawerOpened$
      .subscribe(res => this.opened = res);

    this.subscriptionService.store('_subscribeHierarchyDrawerOpened', sub);
  }

  /**
   * Subscribe opened document hierarchy
   */
  private _subscribeOpenedHierarchy(): void {
    const sub = this.hierarchyService
      .openedHierarchy$
      .subscribe(res => {
        if (this._openedHierarchy?.id !== res?.id) {
          this._openedHierarchy = res;
          this._openHierarchyTree(this._openedHierarchy?.id);
        }
      });

    this.subscriptionService.store('_subscribeOpenedHierarchy', sub);
  }

  /**
   * Open hierarchy tree for opened document
   * @param parentId parent id
   */
  private _openHierarchyTree(parentId?: string): void {
    if (parentId) {
      const parent = HierarchyUtil.findHierarchyById(this.hierarchies, parentId);

      if (parent) {
        parent.opened = true;

        this._openHierarchyTree(parent.parentId);
      }
    }
  }

  /**
   * Subscribe activated route params to get project id from url.
   */
  private _subscribeActivatedRouteParams(): void {
    const sub = this.activatedRoute.paramMap
      .subscribe(res => {
        this._projectId = res.get('id');

        if (this._projectId) {
          this._getHierarchies();
        }
      });

    this.subscriptionService.store('_subscribeActivatedRouteParams', sub);
  }

  /**
   * Get all hierarchies
   */
  private _getHierarchies(): void {
    const promise = this.hierarchyStoreService.getAllByProjectId(this._projectId as string);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.hierarchies = res;
          this._openHierarchyTree(this._openedHierarchy?.id);
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '목록을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getHierarchies', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Subscribe dragging hierarchy
   */
  private _subscribeDraggingHierarchy(): void {
    const sub = this.hierarchyService
      .draggingHierarchy$
      .subscribe(res => {
        this.draggingHierarchy = res;

        if (this.draggingHierarchy) {
          this._addWindowDraggingEvent();
          this._addWindowDragEndEvent();
        } else {
          this._removeWindowDraggingEvent();
          this._removeWindowDragEndEvent();
        }
      });

    this.subscriptionService.store('_subscribeDraggingHierarchy', sub);
  }

  /**
   * Subscribe dragging positions
   */
  private _subscribeDraggingPositions(): void {
    const sub = combineLatest([
      this.hierarchyService.draggingMouseEvent$,
      this.hierarchyService.draggingHierarchyDOMRect$,
    ]).subscribe(res => {
      if (res[0] && res[1]) {
        this._draggingMouseEvent = res[0];
        this.changeDetectorRef.detectChanges();
        this._handleDraggingPositionChange(res[0], res[1]);
      }
    });

    this.subscriptionService.store('_subscribeDraggingPositions', sub);
  }

  /**
   * Add window dragging detecting event
   */
  private _addWindowDraggingEvent(): void {
    this.eventListenerService.addEvent(window, 'mousemove', this._setMouseMovingPosition);
    this.eventListenerService.addEvent(window, 'touchmove', this._setMouseMovingPosition);
  }

  /**
   * Set mouse moving position
   * @param event mouse event
   */
  private _setMouseMovingPosition = (event: MouseEvent | TouchEvent): void => {
    this.hierarchyService.draggingMouseEvent = event;
  }

  /**
   * Add window dragend detecting event
   */
  private _addWindowDragEndEvent(): void {
    this.eventListenerService.addEvent(window, 'mouseup', this._updateHierarchyPositions);
    this.eventListenerService.addEvent(window, 'touchend', this._updateHierarchyPositions);
  }

  /**
   * Update hierarchy positions
   */
  private _updateHierarchyPositions = (): void => {
    const draggingHierarchy = this.draggingHierarchy;
    const droppableEvent = this._droppableEvent;

    if (draggingHierarchy && droppableEvent) {
      const originParent = HierarchyUtil.findAndUpdateDropOriginHierarchy(this.hierarchies, draggingHierarchy, droppableEvent);
      const targetParent = HierarchyUtil.findAndUpdateDropTargetHierarchy(this.hierarchies, draggingHierarchy, droppableEvent);

      const promise = this.hierarchyStoreService.updateRepositionedHierarchies(targetParent, originParent)
      const sub = from(promise)
        .pipe(finalize(() => {
          this._stopDragging();
          this.loadingCoverService.showLoading = false;
        }))
        .subscribe({
          next: () => {
            this._replaceExistingHierarchyChildren(targetParent, true);
            this._replaceExistingHierarchyChildren(originParent);
          },
          error: e => {
            console.error(e);

            this.toastService.open({
              message: '항목을 옮기지 못했습니다',
              type: ToastType.error,
            });
          },
        });

      this.subscriptionService.store('_updateHierarchyPositions', sub);
      this.loadingCoverService.showLoading = true;
    } else {
      this._stopDragging();
    }
  }

  /**
   * Replace existing hierarchy children with updated children
   * @param hierarchy updated hierarchy
   * @param open set `true` to open hierarchy after replacing children
   */
  private _replaceExistingHierarchyChildren(hierarchy?: HierarchyItem, open = false): void {
    if (hierarchy) {
      const _target = HierarchyUtil.findHierarchyById(this.hierarchies, hierarchy.id as string);

      if (_target) {
        _target.children = hierarchy.children || [];
        _target.opened = open ? true : _target.opened;
      }
    }
  }

  /**
   * Stop dragging
   * This will be called after updating hierarchy positions
   */
  private _stopDragging(): void {
    this.hierarchyService.draggingMouseEvent = undefined;
    this.hierarchyService.draggingHierarchy = undefined;
  }

  /**
   * Remove mousemove event from window
   */
  private _removeWindowDraggingEvent(): void {
    this.eventListenerService.removeEvent(window, 'mousemove', this._setMouseMovingPosition);
    this.eventListenerService.removeEvent(window, 'touchmove', this._setMouseMovingPosition);
  }

  /**
   * Remove mouseup event from window
   */
  private _removeWindowDragEndEvent(): void {
    this.eventListenerService.removeEvent(window, 'mouseup', this._updateHierarchyPositions);
    this.eventListenerService.removeEvent(window, 'touchend', this._updateHierarchyPositions);
  }

  /**
   * Get droppableEvent from focused dropzone
   * @param event mouse event
   * @param draggingDOMRect dragging dom rect
   */
  private _handleDraggingPositionChange(event: MouseEvent | TouchEvent, draggingDOMRect: DOMRect): void {
    const dropzone = this.hierarchyService.checkDroppableDropzones(event, draggingDOMRect);
    const hierarchy = this.hierarchyService.checkDroppableHierarchy(event, draggingDOMRect);

    this._droppableEvent = (dropzone || hierarchy)?.droppableEvent;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Check browser width to set false drawer opened state when viewport is over 1024
   */
  private _checkBrowserWidth(): void {
    const overTablet = window.innerWidth > 1024;

    if (overTablet) {
      this.hierarchyService.hierarchyDrawerOpened = false;
    }
  }

}
