import {Directive, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {HierarchyItem} from '../../../../models/hierarchy-item';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {AvailableKey, CommandKey, EventUtil} from '@tk-ui/utils/event.util';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ProjectSettings} from '@wonder-writer/models/project-settings';

@Directive({
  selector: '[appDocumentContainer]',
})
export class DocumentContainer implements OnInit, OnDestroy {
  // Project settings
  protected _settings?: ProjectSettings;

  constructor(
    protected toastService: ToastService,
    protected projectSettingsService: ProjectSettingsService,
    protected subscriptionService: SubscriptionService,
  ) {
  }

  // Current hierarchy
  protected _hierarchy!: HierarchyItem;

  /**
   * Set opened hierarchy to get manuscript by hierarchy id
   * @param hierarchy hierarchy
   */
  @Input() set hierarchy(hierarchy: HierarchyItem) {
    // Save changes automatically if previous hierarchy is exists
    if (this._hierarchy && this.hasChanges) {
      this._saveChangesAutomatically();
    }

    this._hierarchy = hierarchy;
    this._onHierarchyChange();
  }

  /**
   * Get content width
   */
  get contentWidth(): string {
    return `${this._settings?.contentWidth || 0}px`;
  }

  /**
   * Return the changed state
   */
  get hasChanges(): boolean {
    throw new Error(`'hasChanges' getter should be overridden`);
  }

  ngOnInit(): void {
    this._subscribeProjectSettings();
  }

  ngOnDestroy(): void {
    if (this.hasChanges) {
      this._saveChangesAutomatically();
    }
  }

  /**
   * Handle save click event of document header
   */
  onSaveClick(): void {
    this._saveChangesManually();
  }

  /**
   * Listen window keydown event
   * @param event event
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    // Save shortcut
    if (
      // Ctrl + S
      EventUtil.isCommand(event, [CommandKey.ctrl], AvailableKey.KeyS)
      // Meta + S
      || EventUtil.isCommand(event, [CommandKey.meta], AvailableKey.KeyS)
    ) {
      EventUtil.neutralize(event);

      this._saveChangesManually();
    }
  }

  /**
   * Subscribe project settings
   */
  protected _subscribeProjectSettings(): void {
    const sub = this.projectSettingsService
      .settings$
      .subscribe(res => this._settings = res);

    this.subscriptionService.store('_subscribeProjectSettings', sub);
  }

  /**
   * Handle hierarchy change.
   * This should be overridden.
   */
  protected _onHierarchyChange(): void {
    throw new Error(`'_onHierarchyChange()' method should be overridden`);
  }

  /**
   * Save changes automatically
   */
  protected _saveChangesAutomatically(): void {
    this._saveChanges(
      () => {
        this.toastService.open({
          message: '자동 저장 되었습니다',
        });
      },
      (err) => {
        console.error(err);

        this.toastService.open({
          message: '자동 저장에 실패했습니다',
        });
      },
    );
  }

  /**
   * Save changes manually
   */
  protected _saveChangesManually(): void {
    this._saveChanges(
      () => {
        this._onManuallySaved();

        this.toastService.open({
          message: '저장 되었습니다',
        });
      },
      (err) => {
        console.error(err);

        this.toastService.open({
          message: '저장에 실패했습니다',
        });
      },
    );
  }

  /**
   * Handle after manually saved
   */
  protected _onManuallySaved(): void {
    throw new Error(`'_onManuallySaved()' method should be overridden`);
  }

  /**
   * Save changes handler
   * This should be overridden
   * @param next next callback
   * @param error error callback
   */
  protected _saveChanges(next: () => void, error: (err: Error) => void): void {
    throw new Error(`'_saveChanges()' method should be overridden`);
  }
}
