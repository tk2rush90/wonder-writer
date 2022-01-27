import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';
import {Animator} from '@tk-ui/utils/animation.util';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {ProjectSettings} from '@wonder-writer/models/project-settings';

@Component({
  selector: 'app-loading-cover',
  templateUrl: './loading-cover.component.html',
  styleUrls: ['./loading-cover.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class LoadingCoverComponent implements OnInit, OnDestroy {
  // Opacity
  opacity = 0;

  // Visible state
  visible = false;

  // Show spinner state.
  showSpinner = false;

  // Animator
  private _animator: Animator = new Animator<number>();

  // Applied project settings
  private _appliedSettings?: ProjectSettings;

  constructor(
    private projectSettingsService: ProjectSettingsService,
    private loadingCoverService: LoadingCoverService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Get spinner colors by theme
   */
  get spinnerColors(): string[] {
    if (this._appliedSettings?.theme === 'white') {
      return ['#4E91D5'];
    } else {
      return ['#fff'];
    }
  }

  ngOnInit(): void {
    this._subscribeProjectSettings();
    this._subscribeShowLoading();
  }

  ngOnDestroy(): void {
    this._animator.cancel();
  }

  /**
   * Subscribe project settings
   */
  private _subscribeProjectSettings(): void {
    const sub = this.projectSettingsService
      .settings$
      .subscribe(res => this._appliedSettings = res);

    this.subscriptionService.store('_subscribeProjectSettings', sub);
  }

  /**
   * Subscribe show loading state from `LoadingCoverService`
   */
  private _subscribeShowLoading(): void {
    const sub = this.loadingCoverService.showLoading$
      .subscribe(res => {
        if (res) {
          this._showLoading();
        } else {
          this._hideLoading();
        }
      });

    this.subscriptionService.store('_subscribeShowLoading', sub);
  }

  /**
   * Show loading without animation
   */
  private _showLoading(): void {
    this._animator.cancel();
    this.visible = true;
    this.showSpinner = true;
    this.opacity = 1;
  }

  /**
   * Hide loading with animation
   */
  private _hideLoading(): void {
    this.visible = false;
    this._animator.animate({
      start: this.opacity,
      target: 0,
      duration: 500,
      onProgress: value => this.opacity = ParsingUtil.toFloat(value.toFixed(2)),
      onEnd: () => this.showSpinner = false,
    });
  }
}
