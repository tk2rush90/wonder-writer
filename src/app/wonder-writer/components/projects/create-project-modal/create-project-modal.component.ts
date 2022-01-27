import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectStoreService} from '../../../services/db/project-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ProjectItem} from '../../../models/project-item';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {SingleTextFormComponent} from '../../common/single-text-form/single-text-form.component';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class CreateProjectModalComponent implements OnInit {
  // Single text form component
  @ViewChild(SingleTextFormComponent) singleTextForm!: SingleTextFormComponent;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<CreateProjectModalComponent>,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private projectStoreService: ProjectStoreService,
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
      this._createProject();
    } else {
      this.toastService.open({
        message: '프로젝트 명을 입력해주세요',
        type: ToastType.error,
      });
    }
  }

  /**
   * Create new project.
   */
  private _createProject(): void {
    const name = this.singleTextForm.value;

    const promise = this.projectStoreService.addProject(name);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.toastService.open({
            message: '프로젝트가 생성되었습니다',
          });

          this.close(res);
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '프로젝트를 생성할 수 없습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_createProject', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Close the modal
   * @param res returnable result
   */
  close(res?: ProjectItem): void {
    this.modalRef.close(res);
  }
}
