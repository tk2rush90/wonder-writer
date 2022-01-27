import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {HierarchyService} from '@wonder-writer/services/common/hierarchy.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HierarchyItem, HierarchyType} from '@wonder-writer/models/hierarchy-item';
import {ActivatedRoute} from '@angular/router';
import {HierarchyStoreService} from '@wonder-writer/services/db/hierarchy-store.service';
import {from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class DocumentComponent implements OnInit, OnDestroy {
  // Opened hierarchy
  openedHierarchy?: HierarchyItem;

  constructor(
    @Inject(Location) private location: Location,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private hierarchyService: HierarchyService,
    private hierarchyStoreService: HierarchyStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Return `true` when hierarchy is opened
   */
  get hasOpenedHierarchy(): boolean {
    return !!this.openedHierarchy;
  }

  /**
   * Return hierarchy type
   */
  get type(): HierarchyType | undefined {
    return this.openedHierarchy?.type;
  }

  ngOnInit(): void {
    this._subscribeActivatedRouteParamMap();
  }

  ngOnDestroy(): void {
    this.hierarchyService.closeDocumentHierarchy();
    this.openedHierarchy = undefined;
  }

  /**
   * Subscribe parent activated route param map
   */
  private _subscribeActivatedRouteParamMap(): void {
    const sub = this.activatedRoute
      .paramMap
      .subscribe(res => {
        const hierarchyId = res.get('id');

        if (hierarchyId) {
          this._getHierarchy(hierarchyId);
        }
      });

    this.subscriptionService.store('_subscribeActivatedRouteParamMap', sub);
  }

  /**
   * Get hierarchy by id
   * @private
   */
  private _getHierarchy(id: string): void {
    const promise = this.hierarchyStoreService.getHierarchyById(id);
    const sub = from(promise)
      .subscribe({
        next: res => {
          this.hierarchyService.openDocumentHierarchy(res);
          this.openedHierarchy = res;
        },
        error: err => {
          console.error(err);

          this.location.back();

          this.toastService.open({
            message: '문서를 여는 도중 오류가 발생했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getHierarchy', sub);
  }
}
