import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SingleTextFormComponent} from '../../common/single-text-form/single-text-form.component';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {HierarchyStoreService} from '../../../services/db/hierarchy-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {HierarchyItem} from '../../../models/hierarchy-item';
import {finalize, from} from 'rxjs';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';

@Component({
  selector: 'app-create-directory-modal',
  templateUrl: './create-directory-modal.component.html',
  styleUrls: ['./create-directory-modal.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class CreateDirectoryModalComponent implements OnInit {
  // Single text form.
  @ViewChild(SingleTextFormComponent) singleTextForm!: SingleTextFormComponent;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<CreateDirectoryModalComponent>,
    // Should be parent hierarchy
    @Inject(MODAL_DATA) private data: HierarchyItem,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyStoreService: HierarchyStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Handle form submit.
   */
  onSubmit(): void {
    if (this.singleTextForm.valid) {
      this._createDirectory();
    } else {
      this.toastService.open({
        message: '폴더 명을 입력해주세요',
        type: ToastType.error,
      });
    }
  }

  /**
   * Create directory hierarchy.
   */
  private _createDirectory(): void {
    const name = this.singleTextForm.value;

    const promise = this.hierarchyStoreService.addDirectoryHierarchy(name, this.data);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.toastService.open({
            message: '폴더가 생성되었습니다',
          });

          this.close(res);
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '폴더를 생성할 수 없습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_createDirectory', sub);
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
