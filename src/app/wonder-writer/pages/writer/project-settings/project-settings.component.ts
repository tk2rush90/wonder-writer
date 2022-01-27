import {Component, OnInit, ViewChild} from '@angular/core';
import {HeaderService} from '@wonder-writer/services/common/header.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {ProjectTheme} from '@wonder-writer/models/project-settings';
import {ProjectDetailContainer} from '@wonder-writer/pages/writer/project-detail-container/project-detail-container';
import {ProjectSettingsStoreService} from '@wonder-writer/services/db/project-settings-store.service';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {OptionItem} from '@tk-ui/models/option-item';
import {ProjectSettingsUtil} from '@wonder-writer/utils/project-settings.util';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';
import {finalize, from} from 'rxjs';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {cloneDeep} from 'lodash';
import {RangeSliderComponent} from '@wonder-writer/components/common/range-slider/range-slider.component';
import {InputDirective} from '@tk-ui/components/input/input.directive';

export interface ProjectThemeItem {
  value: ProjectTheme;
  color: string;
}

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ProjectSettingsComponent extends ProjectDetailContainer implements OnInit {
  // Content width range slider
  @ViewChild(RangeSliderComponent) rangeSlider!: RangeSliderComponent;

  // Content width input
  @ViewChild(InputDirective) input!: InputDirective;

  // Selectable themes
  themes: ProjectThemeItem[] = [
    {
      value: 'dark',
      color: '#313335',
    },
    {
      value: 'white',
      color: '#FFFFFF',
    },
  ];

  // Font options
  fonts: OptionItem<string>[] = ProjectSettingsUtil.fontOptions;

  // Min content width
  minWidth = 300;

  // Max content width
  maxWidth = 700;

  // Content width temporary value
  private _tempValue?: number;

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

  override ngOnInit(): void {
    super.ngOnInit();

    this._showHeaderActions();
    this._subscribeBackClick();
    this._subscribeActivatedRouteParamMap();
  }

  /**
   * Handle input focus
   */
  onInputFocus(): void {
    this._tempValue = this.settings.contentWidth;
  }

  /**
   * Handle input confirm
   */
  onInputConfirm(): void {
    this._tempValue = this._tempValue as number;

    if (this._tempValue < this.minWidth) {
      this._tempValue = this.minWidth;
    }

    if (this._tempValue > this.maxWidth) {
      this._tempValue = this.maxWidth;
    }

    if (this.settings.contentWidth === this._tempValue) {
      this.rangeSlider?.writeValue(this._tempValue);
      this.input?.writeValue(this._tempValue as any);
    } else {
      this.settings.contentWidth = this._tempValue;
    }
  }

  /**
   * Set temp value when content width input changed
   * @param value value
   */
  onContentWidthChange(value: string): void {
    this._tempValue = ParsingUtil.toInteger(value);
  }

  /**
   * Handle theme change
   * @param theme changed theme
   */
  onThemeChange(theme: ProjectTheme): void {
    this.settings.theme = theme;
  }

  /**
   * Save changes
   */
  saveChanges(): void {
    this._saveProjectSettings();
  }

  /**
   * Show header back button and hide actions.
   */
  private _showHeaderActions(): void {
    this.headerService.showBack = true;
    this.headerService.showMenu = false;
    this.headerService.actions = [];
  }

  /**
   * Subscribe header back button click event.
   */
  private _subscribeBackClick(): void {
    const sub = this.headerService.subscribeBackClick(() => {
      this._navigateToProject();
    });

    this.subscriptionService.store('_subscribeBackClick', sub);
  }

  /**
   * Navigate to project page.
   */
  private _navigateToProject(): void {
    this.router.navigate(['/writer/project', this._projectId])
      .catch(e => {
        console.error(e);

        this.toastService.open({
          message: '페이지를 이동할 수 없습니다',
          type: ToastType.error,
        });
      });
  }

  /**
   * Save project settings
   */
  private _saveProjectSettings(): void {
    const promise = this.projectSettingsStoreService.updateProjectSettings(this.settings);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          this.projectSettingsService.settings = cloneDeep(this.settings);

          this.toastService.open({
            message: '변경 사항이 저장되었습니다',
          });
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '변경 사항을 저장하지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_saveProjectSettings', sub);
    this.loadingCoverService.showLoading = true;
  }
}
