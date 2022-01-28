import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {HierarchyDirectoryType, HierarchyItem} from '../../../../models/hierarchy-item';
import {HierarchyContextMenuItem} from '../hierarchy-context-menu/hierarchy-context-menu.component';
import {HierarchyStoreService} from '../../../../services/db/hierarchy-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';
import {CreateDirectoryModalComponent} from '../../create-directory-modal/create-directory-modal.component';
import {DeleteDirectoryModalComponent} from '../../delete-directory-modal/delete-directory-modal.component';
import {LoadingCoverService} from '../../../../services/common/loading-cover.service';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {
  CreateHierarchyData,
  CreateHierarchyModalComponent
} from '../../create-hierarchy-modal/create-hierarchy-modal.component';
import {DeleteHierarchyModalComponent} from '../../delete-hierarchy-modal/delete-hierarchy-modal.component';
import {HierarchyUtil} from '../../../../utils/hierarchy.util';
import {EditHierarchyModalComponent} from '../../edit-hierarchy-modal/edit-hierarchy-modal.component';
import {Animator} from '@tk-ui/utils/animation.util';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';
import {DroppableEvent, HierarchyService} from '../../../../services/common/hierarchy.service';
import {MathUtil, Rect} from '@tk-ui/utils/math.util';
import {DroppableItem} from '../droppable/droppable-item';
import {EventListenerService} from '../../../../services/others/event-listener.service';
import {ClearHierarchyModalComponent} from '../../clear-hierarchy-modal/clear-hierarchy-modal.component';
import {Router} from '@angular/router';
import {EventUtil} from '@tk-ui/utils/event.util';

@Component({
  selector: 'app-current-hierarchy',
  templateUrl: './current-hierarchy.component.html',
  styleUrls: ['./current-hierarchy.component.scss'],
  providers: [
    SubscriptionService,
    EventListenerService,
  ],
})
export class CurrentHierarchyComponent extends DroppableItem implements OnInit, OnDestroy {
  // Hierarchy depth.
  @Input() depth = 0;

  // Directory type.
  @Input() directoryType!: HierarchyDirectoryType;

  // Hierarchy deleted emitter.
  @Output() hierarchyDeleted: EventEmitter<HierarchyItem> = new EventEmitter<HierarchyItem>();

  // Context menu opened state.
  // Bind to contextmenu opened class.
  @HostBinding('class.ww-contextmenu-opened') contextMenuOpened = false;

  // Mouse event to set context menu position.
  contextMenuMouseEvent?: MouseEvent;

  // Context menu.
  contextMenu: HierarchyContextMenuItem[] = [];

  // Background opacity
  backgroundOpacity?: number;
  // Background animator for long press.
  private _animator: Animator = new Animator<number>();
  // Long press detecting state
  private _longPressed = false;
  // Long press timeout delay
  private _longPressDelay: any;
  // Opened hierarchy
  private _openedHierarchy?: HierarchyItem;

  constructor(
    protected override elementRef: ElementRef<HTMLElement>,
    protected override hierarchyService: HierarchyService,
    protected override subscriptionService: SubscriptionService,
    private router: Router,
    private toastService: ToastService,
    private modalService: ModalService,
    private eventListenerService: EventListenerService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyStoreService: HierarchyStoreService,
  ) {
    super(
      elementRef,
      hierarchyService,
      subscriptionService,
    );
  }

  // Hierarchy data.
  private _data!: HierarchyItem;

  /**
   * Return hierarchy item.
   */
  get data(): HierarchyItem {
    return this._data;
  }

  /**
   * Set hierarchy item.
   * @param data data
   */
  @Input() set data(data: HierarchyItem) {
    this._data = data;
    this._buildContextMenu();

    // Subscribe only for directory
    if (this._data.type === 'directory') {
      this.hierarchyService.registerDroppableHierarchy(this);
    }
  }

  /**
   * Return droppable event
   */
  get droppableEvent(): DroppableEvent {
    return {
      parentId: this._data.id as string,
    };
  }

  /**
   * Return `true` when current hierarchy is opened
   * and bind state to opened class.
   */
  @HostBinding('class.ww-opened') get opened(): boolean {
    return this._openedHierarchy?.id === this._data.id;
  }

  /**
   * Bind left padding with `depth` value.
   */
  @HostBinding('style.padding-left') get paddingLeft(): string {
    return `${this.depth * 21 + 10}px`;
  }

  /**
   * Get is root hierarchy state
   */
  get isRootHierarchy(): boolean {
    return !this._data.parentId && this._data.type === 'directory';
  }

  /**
   * Return `true` when having child hierarchies.
   */
  get hasChildren(): boolean {
    return (this._data.children || []).length > 0;
  }

  /**
   * Return context menu left style.
   */
  get contextMenuLeft(): string | void {
    if (this.contextMenuMouseEvent) {
      return `${this.contextMenuMouseEvent.x}px`;
    }
  }

  /**
   * Return context menu top style.
   */
  get contextMenuTop(): string | void {
    if (this.contextMenuMouseEvent) {
      return `${this.contextMenuMouseEvent.y}px`;
    }
  }

  ngOnInit(): void {
    this._subscribeDraggingHierarchy();
    this._subscribeDraggingScope();
    this._subscribeOpenedHierarchy();
  }

  ngOnDestroy(): void {
    this._animator.cancel();
    this.hierarchyService.unregisterDroppableHierarchy(this);
  }

  /**
   * Check the dragging hierarchy position whether
   * this component contains dragging hierarchy or not
   * @param event mouse event
   * @param draggingDOMRect dragging hierarchy dom rect
   */
  override checkDraggingHierarchyContained(event: MouseEvent | TouchEvent, draggingDOMRect: DOMRect): void {
    if (this._draggingScope === this.directoryType) {
      const domRect = this.element.getBoundingClientRect();
      const {x, y} = EventUtil.getMouseOrTouchXY(event);

      // Create rect area of dragging hierarchy.
      // Use whole area.
      const rect = {
        x: x - draggingDOMRect.width / 2,
        y: y - draggingDOMRect.height / 2,
        width: draggingDOMRect.width,
        height: draggingDOMRect.height,
      };

      // Create rect area of current component.
      // Use only bottom half area.
      const componentRect: Rect = {
        x: domRect.x,
        y: domRect.y + domRect.height / 2,
        width: domRect.width,
        height: domRect.height / 2
      };

      const horizontal = MathUtil.rectHorizontallyOverlapsRect(componentRect, rect) || MathUtil.rectHorizontallyOverlapsRect(rect, componentRect);
      const vertical = MathUtil.rectVerticallyContainsRect(rect, componentRect);

      this.droppable = horizontal && vertical;
    }
  }

  /**
   * Listen host touch start
   */
  @HostListener('click')
  onHostMobileClick(): void {
    if (window.innerWidth < 1024) {
      this.onHostDoubleClick();
    }
  }

  /**
   * Toggle directory opened state
   * @param event mouse event
   */
  toggleDirectoryOpened(event?: MouseEvent): void {
    if (event) {
      EventUtil.neutralize(event);
    }

    const state = !this._data.opened;

    if (!state) {
      this._closeChildrenHierarchies();
    }

    this._data.opened = state;
  }

  /**
   * Handle host double click event.
   */
  @HostListener('dblclick')
  onHostDoubleClick(): void {
    if (this._data.type === 'directory') {
      this.toggleDirectoryOpened();
    } else {
      this._navigateToDocument();
    }
  }

  /**
   * Handle host mousedown event
   * Only works for not root hierarchy.
   * @param event mouse event
   */
  @HostListener('mousedown', ['$event'])
  onHostMouseDown(event: MouseEvent): void {
    if (this._data.parentId) {
      this._longPressed = true;
      this._addWindowMouseUp();

      clearTimeout(this._longPressDelay);

      // Set a delay to catch click and dblclick event correctly
      this._longPressDelay = setTimeout(() => {
        if (this._longPressed) {
          this._startLongPressTimer(event);
        }
      }, 100);
    }
  }

  /**
   * Handle host contextmenu event.
   * @param event mouse event to detect position
   */
  @HostListener('contextmenu', ['$event'])
  onHostContextMenu(event: MouseEvent): void {
    EventUtil.neutralize(event);

    if (window.innerWidth > 1024) {
      this.contextMenuMouseEvent = event;
    }

    this.contextMenuOpened = true;
  }

  /**
   * Start dragging when dragging button clicked
   * @param event event
   */
  onDragButtonClick(event: MouseEvent | TouchEvent): void {
    EventUtil.neutralize(event);

    this._startDragging(event);
  }

  /**
   * Close context menu.
   */
  onContextMenuClose(): void {
    this.contextMenuOpened = false;
    this.contextMenuMouseEvent = undefined;
  }

  /**
   * Subscribe opened document hierarchy
   */
  private _subscribeOpenedHierarchy(): void {
    const sub = this.hierarchyService
      .openedHierarchy$
      .subscribe(res => this._openedHierarchy = res);

    this.subscriptionService.store('_subscribeOpenedHierarchy', sub);
  }

  /**
   * Build context menu by hierarchy type.
   */
  private _buildContextMenu(): void {
    this.contextMenu = [];

    // Add edit feature for not root hierarchy
    if (this._data.parentId) {
      this.contextMenu.push({
        name: '이름 변경',
        click: () => this._openEditHierarchyModal(),
      });
    }

    if (this._data.type === 'directory') {
      this._buildDirectoryContextMenu();
    }

    // Add delete feature for not root hierarchy.
    if (this._data.parentId) {
      this.contextMenu.push({
        name: '삭제',
        click: () => this._handleDeleteEvent(),
      });
    }
  }

  /**
   * Build context menu for directory type.
   */
  private _buildDirectoryContextMenu(): void {
    this.contextMenu.push(
      {
        name: '새 폴더',
        click: () => this._openCreateDirectoryModal(),
      },
      {
        name: `새 ${HierarchyUtil.getTypeLabel(this._data.directoryType as HierarchyDirectoryType)}`,
        click: () => this._openCreateHierarchyModal(),
      },
      {
        name: '비우기',
        click: () => this._openClearHierarchyModal(),
      },
    );
  }

  /**
   * Close all children hierarchies.
   * @param hierarchy root hierarchy
   */
  private _closeChildrenHierarchies(hierarchy = this._data): void {
    (hierarchy.children || []).forEach(item => {
      if (item.type === 'directory') {
        this._closeChildrenHierarchies(item);
        item.opened = false;
      }
    });
  }

  /**
   * Navigate to document detail
   */
  private _navigateToDocument(): void {
    this.hierarchyService.hierarchyDrawerOpened = false;
    this.router.navigate(['/writer/project', this._data.projectId, this._data.id])
      .catch(e => {
        console.error(e);

        this.toastService.open({
          message: '문서를 열 수 없습니다',
          type: ToastType.error,
        });
      });
  }

  /**
   * Start long press timer before dragging
   * @param event mouse event
   */
  private _startLongPressTimer(event: MouseEvent): void {
    this._animator.animate({
      start: .5,
      target: 1,
      duration: 150,
      onProgress: res => this.backgroundOpacity = ParsingUtil.toFloat(res.toFixed(2)),
      onEnd: () => this._startDragging(event),
    });
  }

  /**
   * Start dragging with mouse event
   * @param event mouse event
   */
  private _startDragging(event: MouseEvent | TouchEvent): void {
    this.hierarchyService.draggingScope = this.directoryType;
    this.hierarchyService.draggingHierarchy = this._data;
    this.hierarchyService.draggingMouseEvent = event;
  }

  /**
   * Add global mouseup event to stop dragging
   */
  private _addWindowMouseUp(): void {
    this.eventListenerService.addEvent(window, 'mouseup', this._handleWindowMouseUp);
    this.eventListenerService.addEvent(window, 'touchend', this._handleWindowMouseUp);
  }

  /**
   * Stop dragging when window mouseup
   */
  private _handleWindowMouseUp = (): void => {
    this.backgroundOpacity = undefined;
    this._longPressed = false;
    this._animator.cancel();

    clearTimeout(this._longPressDelay);
  }

  /**
   * Open modal to create directory.
   */
  private _openCreateDirectoryModal(): void {
    this.modalService.open(CreateDirectoryModalComponent, {
      data: this._data,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._data.opened = true;
          this._data.children!.push(res);
        }
      },
    });
  }

  /**
   * Handle delete event.
   */
  private _handleDeleteEvent(): void {
    switch (this._data.type) {
      case 'directory': {
        this._openDeleteDirectoryModal();
        break;
      }

      default: {
        this._openDeleteHierarchyModal();
      }
    }
  }

  /**
   * Open modal to delete directory.
   */
  private _openDeleteDirectoryModal(): void {
    this.modalService.open(DeleteDirectoryModalComponent, {
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._deleteDirectory();
        }
      },
    });
  }

  /**
   * Delete directory.
   */
  private _deleteDirectory(): void {
    const promise = this.hierarchyStoreService.deleteDirectoryHierarchy(this._data);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          this.toastService.open({
            message: '폴더가 삭제되었습니다',
          });

          this.hierarchyDeleted.emit(this._data);
          this.hierarchyService.emitHierarchyChanged();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '폴더를 삭제하지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_deleteDirectory', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Open create hierarchy modal
   */
  private _openCreateHierarchyModal(): void {
    this.modalService.open(CreateHierarchyModalComponent, {
      data: {
        parent: this._data,
        type: this._data.directoryType,
      } as CreateHierarchyData,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._data.opened = true;
          this._data.children!.push(res);
        }
      },
    });
  }

  /**
   * Open delete article hierarchy modal.
   */
  private _openDeleteHierarchyModal(): void {
    this.modalService.open(DeleteHierarchyModalComponent, {
      data: this._data,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._deleteHierarchy();
        }
      },
    });
  }

  /**
   * Delete article hierarchy
   */
  private _deleteHierarchy(): void {
    const promise = this.hierarchyStoreService.deleteHierarchy(this._data);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          this.toastService.open({
            message: HierarchyUtil.getDeleteSuccessMessage(this._data.type),
          });

          this._unselectOpenedHierarchy();
          this.hierarchyDeleted.emit(this._data);
          this.hierarchyService.emitHierarchyChanged();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: HierarchyUtil.getDeleteFailureMessage(this._data.type),
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_deleteDirectory', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Open edit hierarchy modal.
   */
  private _openEditHierarchyModal(): void {
    this.modalService.open(EditHierarchyModalComponent, {
      data: this._data,
      closeOnNavigating: true,
      onClose: (res: HierarchyItem) => {
        if (res) {
          this._data.name = res.name;
          this.hierarchyService.emitHierarchyChanged();
        }
      },
    });
  }

  /**
   * When the current hierarchy is opened,
   * close opened document.
   */
  private _unselectOpenedHierarchy(): void {
    if (this._openedHierarchy?.id === this._data.id) {
      this.hierarchyService.closeDocumentHierarchy();
    }
  }

  /**
   * Open clear hierarchy modal.
   */
  private _openClearHierarchyModal(): void {
    this.modalService.open(ClearHierarchyModalComponent, {
      closeOnNavigating: true,
      onClose: (res: boolean) => {
        if (res) {
          this._clearHierarchy();
        }
      },
    });
  }

  /**
   * Clear hierarchy
   */
  private _clearHierarchy(): void {
    const promise = this.hierarchyStoreService.clearHierarchy(this._data);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          // Clear children and close hierarchy
          this._data.children = [];
          this._data.opened = false;

          this.toastService.open({
            message: '폴더를 모두 비웠습니다',
          });
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '폴더를 비우지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_clearHierarchy', sub);
    this.loadingCoverService.showLoading = true;
  }
}
