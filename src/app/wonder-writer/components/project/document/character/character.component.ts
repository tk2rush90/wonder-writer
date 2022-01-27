import {ChangeDetectorRef, Component} from '@angular/core';
import {SplitViewDocumentContainer} from '../document-container/split-view-document-container';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {CharacterStoreService} from '@wonder-writer/services/db/character-store.service';
import {Character} from '@wonder-writer/models/character';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {StorageService} from '@tk-ui/services/common/storage.service';
import {cloneDeep, isEqual} from 'lodash';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: [
    '../styles/split-view-document-container.scss',
    './character.component.scss',
  ],
  providers: [
    SubscriptionService,
  ]
})
export class CharacterComponent extends SplitViewDocumentContainer {
  // Character
  character!: Character;

  // Original character
  private _origin!: Character;

  constructor(
    protected override toastService: ToastService,
    protected override storageService: StorageService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override subscriptionService: SubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingCoverService: LoadingCoverService,
    private characterStoreService: CharacterStoreService,
  ) {
    super(
      toastService,
      projectSettingsService,
      subscriptionService,
      storageService,
    );
  }

  /**
   * Get content changed state
   */
  override get hasChanges(): boolean {
    return !isEqual(this.character, this._origin);
  }

  /**
   * Handle hierarchy change
   */
  protected override _onHierarchyChange(): void {
    this._getCharacter();
  }

  /**
   * Override after manually saved handler
   */
  protected override _onManuallySaved(): void {
    this._origin = cloneDeep(this.character);
  }

  /**
   * Handle save changes
   * @param next next callback
   * @param error error callback
   */
  protected override _saveChanges(next: () => void, error: (err: Error) => void): void {
    const promise = this.characterStoreService.updateCharacter(this.character);
    const sub = from(promise)
      .subscribe({
        next: () => next(),
        error: err => error(err),
      });

    this.subscriptionService.store('_saveChanges', sub);
  }

  /**
   * Get character with hierarchy id
   */
  private _getCharacter(): void {
    const promise = this.characterStoreService.getCharacterByHierarchy(this._hierarchy);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this._origin = cloneDeep(res);
          this.character = res;
          this.changeDetectorRef.detectChanges();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '인물을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getCharacter', sub);
    this.loadingCoverService.showLoading = true;
  }
}
