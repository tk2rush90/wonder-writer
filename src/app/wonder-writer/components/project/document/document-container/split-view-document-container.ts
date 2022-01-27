import {DocumentContainer} from './document-container';
import {Directive, HostBinding, HostListener, OnInit} from '@angular/core';
import {DocumentAction} from '../document-header-action/document-header-action.component';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {StorageService} from '@tk-ui/services/common/storage.service';
import {SPLIT_VIEW_STATE} from '@wonder-writer/utils/session-storage-keys';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';

export type SplitView = 'left' | 'right' | 'both';
export type ViewPort = 'mobile' | 'pc';

@Directive({
  selector: '[appSplitViewDocumentContainer]',
})
export class SplitViewDocumentContainer extends DocumentContainer implements OnInit {
  // Split view type
  // Bind to view attribute
  @HostBinding('attr.ww-view') view: SplitView = 'left';

  // Split view actions
  actions: DocumentAction[][] = [];

  // View actions
  protected _viewLeft = new DocumentAction('view-left', () => this._setSplitView('left'));
  protected _viewRight = new DocumentAction('view-right', () => this._setSplitView('right'));
  protected _viewBoth = new DocumentAction('view-both', () => this._setSplitView('both'));

  // Window last checked width
  private _lastViewPort!: ViewPort;

  constructor(
    protected override toastService: ToastService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override subscriptionService: SubscriptionService,
    protected storageService: StorageService,
  ) {
    super(toastService, projectSettingsService, subscriptionService);
  }

  /**
   * Return `true` when left view is displayable.
   */
  get showLeft(): boolean {
    return this.view === 'left' || this.view === 'both';
  }

  /**
   * Return `true` when right view is displayable.
   */
  get showRight(): boolean {
    return this.view === 'right' || this.view === 'both';
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const view = this.storageService.getFromSession<SplitView>(SPLIT_VIEW_STATE);

    this._setSplitView(view || 'left');
    this._checkBrowserWidth();
  }

  /**
   * Handle window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._checkBrowserWidth();
  }

  /**
   * Check browser width
   */
  protected _checkBrowserWidth(): void {
    const overTablet = window.innerWidth > 1024;
    const viewPort: ViewPort = overTablet ? 'pc' : 'mobile';

    if (viewPort !== this._lastViewPort) {
      this._buildDocumentActions();
      this._setSplitViewByBrowserWidth();
    }

    this._lastViewPort = viewPort;
  }

  /**
   * Build document actions
   */
  protected _buildDocumentActions(): void {
    if (window.innerWidth > 1024) {
      this.actions = [
        [
          this._viewLeft,
          this._viewRight,
          this._viewBoth,
        ],
      ];
    } else {
      this.actions = [
        [
          this._viewLeft,
          this._viewRight,
        ],
      ];
    }
  }

  /**
   * Set view value by browser width
   */
  protected _setSplitViewByBrowserWidth(): void {
    if (window.innerWidth <= 1024 && this.view === 'both') {
      this._setSplitView('left');
    }
  }

  /**
   * Set split view and update active state
   * @param view view
   */
  protected _setSplitView(view: SplitView): void {
    this.view = view;

    this._viewLeft.active = this.view === 'left';
    this._viewRight.active = this.view === 'right';
    this._viewBoth.active = this.view === 'both';

    this.storageService.setToSession(SPLIT_VIEW_STATE, view);
  }
}
