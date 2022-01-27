import {Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {HeaderService} from '../../../services/common/header.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {ProjectDetailContainer} from '@wonder-writer/pages/writer/project-detail-container/project-detail-container';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {ProjectSettingsStoreService} from '@wonder-writer/services/db/project-settings-store.service';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ProjectComponent extends ProjectDetailContainer implements OnInit {
  constructor(
    protected override activatedRoute: ActivatedRoute,
    protected override toastService: ToastService,
    protected override loadingCoverService: LoadingCoverService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override projectSettingsStoreService: ProjectSettingsStoreService,
    protected override subscriptionService: SubscriptionService,
    private router: Router,
    private headerService: HeaderService,
  ) {
    super(
      activatedRoute,
      toastService,
      loadingCoverService,
      projectSettingsService,
      projectSettingsStoreService,
      subscriptionService,
    );
  }

  /**
   * Bind noto sans class
   */
  @HostBinding('class.noto-sans') get notoSans(): boolean {
    return this._appliedSettings?.contentFont === 'NotoSans';
  }

  /**
   * Bind noto serif class
   */
  @HostBinding('class.noto-serif') get notoSerif(): boolean {
    return this._appliedSettings?.contentFont === 'NotoSerif';
  }

  /**
   * Bind nanum gothic class
   */
  @HostBinding('class.nanum-gothic') get nanumGothic(): boolean {
    return this._appliedSettings?.contentFont === 'NanumGothic';
  }

  /**
   * Bind nanum myeongjo class
   */
  @HostBinding('class.nanum-myeongjo') get nanumMyeongjo(): boolean {
    return this._appliedSettings?.contentFont === 'NanumMyeongjo';
  }

  /**
   * Listen window resize event
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this._checkBrowserWidth();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._checkBrowserWidth();

    this._showHeaderActions();
    this._subscribeBackClick();
    this._subscribeActivatedRouteParamMap();
  }

  /**
   * Check browser width to set header state
   */
  protected _checkBrowserWidth(): void {
    const overTablet = window.innerWidth > 1024;

    this.headerService.showMenu = !overTablet;
  }

  /**
   * Show header back button and actions.
   */
  private _showHeaderActions(): void {
    this.headerService.showBack = true;
    this.headerService.actions = [
      {
        name: 'settings',
        click: () => this._navigateToProjectSettings(),
      },
    ];
  }

  /**
   * Subscribe header back button click event.
   */
  private _subscribeBackClick(): void {
    const sub = this.headerService.subscribeBackClick(() => {
      this._navigateToProjects();
    });

    this.subscriptionService.store('_subscribeBackClick', sub);
  }

  /**
   * Navigate to projects page.
   */
  private _navigateToProjects(): void {
    this.router.navigate(['/writer/projects'])
      .catch(e => {
        console.error(e);

        this.toastService.open({
          message: '페이지를 이동할 수 없습니다',
          type: ToastType.error,
        });
      });
  }

  /**
   * Navigate to project settings page.
   */
  private _navigateToProjectSettings(): void {
    this.router.navigate(['/writer/project', this._projectId, 'settings'])
      .catch(e => {
        console.error(e);

        this.toastService.open({
          message: '페이지를 이동할 수 없습니다',
          type: ToastType.error,
        });
      });
  }
}
