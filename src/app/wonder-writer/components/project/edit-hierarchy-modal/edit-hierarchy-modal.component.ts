import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SingleTextFormComponent} from '../../common/single-text-form/single-text-form.component';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';
import {HierarchyStoreService} from '../../../services/db/hierarchy-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {HierarchyUtil} from '../../../utils/hierarchy.util';
import {finalize, from} from 'rxjs';
import {HierarchyItem} from '../../../models/hierarchy-item';

@Component({
  selector: 'app-edit-hierarchy-modal',
  templateUrl: './edit-hierarchy-modal.component.html',
  styleUrls: ['./edit-hierarchy-modal.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class EditHierarchyModalComponent implements OnInit, AfterViewInit {
  // Single text form.
  @ViewChild(SingleTextFormComponent) singleTextForm!: SingleTextFormComponent;

  // Type label
  typeLabel!: string;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<EditHierarchyModalComponent>,
    // Hierarchy to edit
    @Inject(MODAL_DATA) private data: HierarchyItem,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyStoreService: HierarchyStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._setTypeLabel();
  }

  ngAfterViewInit(): void {
    this._setInitialValue();
  }

  /**
   * Set text variables
   */
  private _setTypeLabel(): void {
    this.typeLabel = HierarchyUtil.getTypeLabel(this.data.type, true);
  }

  /**
   * Set initial value.
   */
  private _setInitialValue(): void {
    this.singleTextForm.initialValue = this.data.name;
  }

  /**
   * Handle form submit.
   */
  onSubmit(): void {
    if (this.singleTextForm.valid) {
      this._editHierarchy();
    } else {
      this.toastService.open({
        message: `${this.typeLabel} 명을 입력해주세요`,
        type: ToastType.error,
      });
    }
  }

  /**
   * Edit hierarchy name.
   */
  private _editHierarchy(): void {
    const name = this.singleTextForm.value;
    const hierarchy = {
      ...this.data,
      name,
    };

    const promise = this.hierarchyStoreService.updateHierarchy(hierarchy);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.toastService.open({
            message: HierarchyUtil.getEditSuccessMessage(this.data.type),
          });

          this.close(res);
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: HierarchyUtil.getEditFailureMessage(this.data.type),
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_editHierarchy', sub);
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
