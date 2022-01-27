import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  SplitViewDocumentContainer
} from '@wonder-writer/components/project/document/document-container/split-view-document-container';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {PlaceStoreService} from '@wonder-writer/services/db/place-store.service';
import {Place} from '@wonder-writer/models/place';
import {StorageService} from '@tk-ui/services/common/storage.service';
import {cloneDeep, isEqual} from 'lodash';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: [
    '../styles/split-view-document-container.scss',
    './place.component.scss',
  ],
  providers: [
    SubscriptionService,
  ]
})
export class PlaceComponent extends SplitViewDocumentContainer implements OnInit {
  // Place
  place!: Place;

  // Original place
  private _origin!: Place;

  constructor(
    protected override toastService: ToastService,
    protected override storageService: StorageService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override subscriptionService: SubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingCoverService: LoadingCoverService,
    private placeStoreService: PlaceStoreService,
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
    return !isEqual(this.place, this._origin);
  }

  /**
   * Handle hierarchy change
   */
  protected override _onHierarchyChange(): void {
    this._getPlace();
  }

  /**
   * Override after manually saved handler
   */
  protected override _onManuallySaved(): void {
    this._origin = cloneDeep(this.place);
  }

  /**
   * Handle save changes
   * @param next next callback
   * @param error error callback
   */
  protected override _saveChanges(next: () => void, error: (err: Error) => void): void {
    const promise = this.placeStoreService.updatePlace(this.place);
    const sub = from(promise)
      .subscribe({
        next: () => next(),
        error: err => error(err),
      });

    this.subscriptionService.store('_saveChanges', sub);
  }

  /**
   * Get place with hierarchy id
   */
  private _getPlace(): void {
    const promise = this.placeStoreService.getPlaceByHierarchy(this._hierarchy);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this._origin = cloneDeep(res);
          this.place = res;
          this.changeDetectorRef.detectChanges();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '장소를 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getPlace', sub);
    this.loadingCoverService.showLoading = true;
  }
}
