import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SingleTextFormComponent} from '../../common/single-text-form/single-text-form.component';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {HierarchyItem, HierarchyType} from '../../../models/hierarchy-item';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';
import {HierarchyStoreService} from '../../../services/db/hierarchy-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {finalize, from} from 'rxjs';
import {HierarchyUtil} from '../../../utils/hierarchy.util';

export interface CreateHierarchyData {
  parent: HierarchyItem;
  type: HierarchyType;
}

@Component({
  selector: 'app-create-hierarchy-modal',
  templateUrl: './create-hierarchy-modal.component.html',
  styleUrls: ['./create-hierarchy-modal.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class CreateHierarchyModalComponent implements OnInit {
  // Single text form.
  @ViewChild(SingleTextFormComponent) singleTextForm!: SingleTextFormComponent;

  // Type label
  typeLabel!: string;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<CreateHierarchyModalComponent>,
    @Inject(MODAL_DATA) private data: CreateHierarchyData,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyStoreService: HierarchyStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._setTypeLabel();
  }

  /**
   * Set text variables
   */
  private _setTypeLabel(): void {
    this.typeLabel = HierarchyUtil.getTypeLabel(this.data.type);
  }

  /**
   * Handle form submit.
   */
  onSubmit(): void {
    if (this.singleTextForm.valid) {
      this._createHierarchy();
    } else {
      this.toastService.open({
        message: `${this.typeLabel} 명을 입력해주세요`,
        type: ToastType.error,
      });
    }
  }

  /**
   * Create article hierarchy.
   */
  private _createHierarchy(): void {
    const name = this.singleTextForm.value;

    const promise = this.hierarchyStoreService.addHierarchy(name, this.data.type, this.data.parent);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.toastService.open({
            message: HierarchyUtil.getCreateSuccessMessage(this.data.type),
          });

          this.close(res);
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: HierarchyUtil.getCreateFailureMessage(this.data.type),
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_createHierarchy', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Close with response.
   * @param res response
   */
  close(res?: HierarchyItem): void {
    this.modalRef.close(res);
  }
}
