import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {ProjectStoreService} from '../../../services/db/project-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ProjectItem} from '../../../models/project-item';
import {finalize, from} from 'rxjs';
import {SingleTextFormComponent} from '../../common/single-text-form/single-text-form.component';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss']
})
export class EditProjectModalComponent implements OnInit, AfterViewInit {
  // Single text form component
  @ViewChild(SingleTextFormComponent) singleTextForm!: SingleTextFormComponent;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<EditProjectModalComponent>,
    @Inject(MODAL_DATA) private data: ProjectItem,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private projectStoreService: ProjectStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._initNameControl();
  }

  /**
   * Init name control with existing project name.
   */
  private _initNameControl(): void {
    this.singleTextForm.initialValue = this.data.name;
  }

  /**
   * Handle form submit.
   */
  onSubmit(): void {
    if (this.singleTextForm.valid) {
      this._updateProject();
    } else {
      this.toastService.open({
        message: '프로젝트 명을 입력해주세요',
        type: ToastType.error,
      });
    }
  }

  /**
   * Update existing project.
   */
  private _updateProject(): void {
    const name = this.singleTextForm.value;
    const project: ProjectItem = {
      ...this.data,
      name,
    };

    const promise = this.projectStoreService.updateProject(project);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.toastService.open({
            message: '프로젝트가 수정되었습니다',
          });

          this.close(res);
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '프로젝트를 수정할 수 없습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_updateProject', sub);
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
