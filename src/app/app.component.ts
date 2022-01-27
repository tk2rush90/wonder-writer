import {Component, HostBinding, OnInit} from '@angular/core';
import {DbService} from '@wonder-writer/services/db/db.service';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {DB_CONFIG} from '@wonder-writer/services/db/db-config';
import {lastValueFrom} from 'rxjs';
import {ToastService} from '@tk-ui/components/toast/service/toast.service';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ProjectSettings} from '@wonder-writer/models/project-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SubscriptionService,
  ]
})
export class AppComponent implements OnInit {
  // Database ready state.
  databaseReady = false;

  // Project settings to bind theme class
  private _projectSettings?: ProjectSettings;

  constructor(
    private dbService: DbService,
    private toastService: ToastService,
    private projectSettingsService: ProjectSettingsService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Bind light theme class
   */
  @HostBinding('class.ww-light-theme') get lightTheme(): boolean {
    return this._projectSettings?.theme === 'white';
  }

  /**
   * Bind dark theme class
   */
  @HostBinding('class.ww-dark-theme') get darkTheme(): boolean {
    return this._projectSettings?.theme === 'dark';
  }

  ngOnInit(): void {
    this._subscribeProjectSettings();
    this._initDB()
      .catch(() => {
        this.toastService.open({
          message: '데이터베이스 초기화 실패',
        });
      });
  }

  /**
   * Initialize the db.
   */
  private async _initDB(): Promise<void> {
    await lastValueFrom(IndexedDbUtil.initDb(DB_CONFIG));
    await lastValueFrom(this.dbService.connect());

    this.databaseReady = true;
  }

  /**
   * Subscribe project settings to bind theme class
   */
  private _subscribeProjectSettings(): void {
    const sub = this.projectSettingsService
      .settings$
      .subscribe(res => this._projectSettings = res);

    this.subscriptionService.store('_subscribeProjectSettings', sub);
  }
}
