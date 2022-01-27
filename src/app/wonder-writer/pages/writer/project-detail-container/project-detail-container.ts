import {Directive, OnDestroy, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ActivatedRoute} from '@angular/router';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {ProjectSettingsStoreService} from '@wonder-writer/services/db/project-settings-store.service';
import {ProjectSettings} from '@wonder-writer/models/project-settings';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {cloneDeep} from 'lodash';

@Directive({
  selector: '[appProjectDetailContainer]',
})
export class ProjectDetailContainer implements OnInit, OnDestroy {
  // Project settings
  settings!: ProjectSettings;

  // Current applied settings
  protected _appliedSettings?: ProjectSettings;

  // Project id
  protected _projectId!: string;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected toastService: ToastService,
    protected loadingCoverService: LoadingCoverService,
    protected projectSettingsService: ProjectSettingsService,
    protected projectSettingsStoreService: ProjectSettingsStoreService,
    protected subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._subscribeProjectSettings();
  }

  ngOnDestroy(): void {
    this.projectSettingsService.settings = undefined;
  }

  /**
   * Subscribe activated route param map to get project id
   */
  protected _subscribeActivatedRouteParamMap(): void {
    const sub = this.activatedRoute
      .paramMap
      .subscribe(res => {
        const projectId = res.get('id');

        if (projectId) {
          this._projectId = projectId;
          this._getProjectSettings();
        }
      });

    this.subscriptionService.store('_subscribeActivatedRouteParamMap', sub);
  }

  /**
   * Get project settings
   */
  protected _getProjectSettings(): void {
    const promise = this.projectSettingsStoreService.getProjectSettingsByProjectId(this._projectId);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.settings = res;
          this.projectSettingsService.settings = cloneDeep(res);
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '프로젝트 설정을 가져오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getProjectSettings', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Subscribe stored project settings
   */
  protected _subscribeProjectSettings(): void {
    const sub = this.projectSettingsService
      .settings$
      .subscribe(res => this._appliedSettings = res);

    this.subscriptionService.store('_subscribeProjectSettings', sub);
  }
}
