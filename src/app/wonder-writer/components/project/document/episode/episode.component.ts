import {ChangeDetectorRef, Component} from '@angular/core';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {
  SplitViewDocumentContainer
} from '@wonder-writer/components/project/document/document-container/split-view-document-container';
import {Episode} from '@wonder-writer/models/episode';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {EpisodeStoreService} from '@wonder-writer/services/db/episode-store.service';
import {finalize, from} from 'rxjs';
import {StorageService} from '@tk-ui/services/common/storage.service';
import {cloneDeep, isEqual} from 'lodash';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: [
    '../styles/split-view-document-container.scss',
    './episode.component.scss',
  ],
  providers: [
    SubscriptionService,
  ]
})
export class EpisodeComponent extends SplitViewDocumentContainer {
  // Episode
  episode!: Episode;

  // Original episode
  private _origin!: Episode;

  constructor(
    protected override toastService: ToastService,
    protected override storageService: StorageService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override subscriptionService: SubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingCoverService: LoadingCoverService,
    private episodeStoreService: EpisodeStoreService,
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
    return !isEqual(this.episode, this._origin);
  }

  /**
   * Handle hierarchy change
   */
  protected override _onHierarchyChange(): void {
    this._getEpisode();
  }

  /**
   * Override after manually saved handler
   */
  protected override _onManuallySaved(): void {
    this._origin = cloneDeep(this.episode);
  }

  /**
   * Handle save changes
   * @param next next callback
   * @param error error callback
   */
  protected override _saveChanges(next: () => void, error: (err: Error) => void): void {
    const promise = this.episodeStoreService.updateEpisode(this.episode);
    const sub = from(promise)
      .subscribe({
        next: () => next(),
        error: err => error(err),
      });

    this.subscriptionService.store('_saveChanges', sub);
  }

  /**
   * Get episode with hierarchy id
   */
  private _getEpisode(): void {
    const promise = this.episodeStoreService.getEpisodeByHierarchy(this._hierarchy);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this._origin = cloneDeep(res);
          this.episode = res;
          this.changeDetectorRef.detectChanges();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '사건을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getEpisode', sub);
    this.loadingCoverService.showLoading = true;
  }
}
