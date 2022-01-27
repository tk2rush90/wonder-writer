import {Component, OnInit} from '@angular/core';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HeaderAction, HeaderService} from '../../../services/common/header.service';
import {HierarchyService} from '@wonder-writer/services/common/hierarchy.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class HeaderComponent implements OnInit {
  // Show back button state.
  showBack = false;

  // Show menu button state
  showMenu = false;

  // Header actions.
  actions: HeaderAction[] = [];

  // Drawer opened state
  private _drawerOpened = false;

  constructor(
    private headerService: HeaderService,
    private hierarchyService: HierarchyService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._subscribeShowBack();
    this._subscribeShowMenu();
    this._subscribeHeaderActions();
    this._subscribeHierarchyDrawerOpened();
  }

  /**
   * Handle back button click event.
   */
  onBackClick(): void {
    this.headerService.emitBackClick();
  }

  /**
   * Toggle hierarchy opened state
   */
  toggleHierarchy(): void {
    this.hierarchyService.hierarchyDrawerOpened = !this._drawerOpened;
  }

  /**
   * Subscribe show back state.
   */
  private _subscribeShowBack(): void {
    const sub = this.headerService
      .showBack$
      .subscribe(res => this.showBack = res);

    this.subscriptionService.store('_subscribeShowBack', sub);
  }

  /**
   * Subscribe show back state.
   */
  private _subscribeShowMenu(): void {
    const sub = this.headerService
      .showMenu$
      .subscribe(res => this.showMenu = res);

    this.subscriptionService.store('_subscribeShowMenu', sub);
  }

  /**
   * Subscribe header actions.
   */
  private _subscribeHeaderActions(): void {
    const sub = this.headerService
      .actions$
      .subscribe(res => this.actions = res);

    this.subscriptionService.store('_subscribeHeaderActions', sub);
  }

  /**
   * Subscribe hierarchy drawer opened state
   */
  private _subscribeHierarchyDrawerOpened(): void {
    const sub = this.hierarchyService
      .hierarchyDrawerOpened$
      .subscribe(res => this._drawerOpened = res);

    this.subscriptionService.store('_subscribeHierarchyDrawerOpened', sub);
  }
}
