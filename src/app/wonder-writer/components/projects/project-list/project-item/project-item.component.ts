import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectItem} from '../../../../models/project-item';
import {ProjectStoreService} from '../../../../services/db/project-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {finalize, from} from 'rxjs';
import {EventUtil} from '@tk-ui/utils/event.util';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';
import {DeleteProjectModalComponent} from '../../delete-project-modal/delete-project-modal.component';
import {EditProjectModalComponent} from '../../edit-project-modal/edit-project-modal.component';
import {LoadingCoverService} from '../../../../services/common/loading-cover.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ProjectItemComponent implements OnInit {
  // Project item model.
  @Input() data!: ProjectItem;

  // Project deleted emitter.
  @Output() projectDeleted: EventEmitter<ProjectItem> = new EventEmitter<ProjectItem>();

  // Project edited emitter.
  @Output() projectEdited: EventEmitter<ProjectItem> = new EventEmitter<ProjectItem>();

  constructor(
    private toastService: ToastService,
    private modalService: ModalService,
    private loadingCoverService: LoadingCoverService,
    private projectStoreService: ProjectStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Handle delete icon click.
   * @param event mouse event
   */
  onClickDelete(event: MouseEvent): void {
    EventUtil.neutralize(event);

    this._openDeleteModal();
  }

  /**
   * Open delete modal.
   */
  private _openDeleteModal(): void {
    this.modalService.open(DeleteProjectModalComponent, {
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._deleteProject();
        }
      },
    });
  }

  /**
   * Delete current project.
   */
  private _deleteProject(): void {
    const promise = this.projectStoreService.deleteProject(this.data);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          this.projectDeleted.emit(this.data);
          this.toastService.open({
            message: '프로젝트가 삭제되었습니다',
          });
        },
        error: err => {
          console.error(err);
          this.toastService.open({
            message: '프로젝트를 삭제하지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('deleteProject', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Handle click edit event.
   * @param event mouse event
   */
  onClickEdit(event: MouseEvent): void {
    EventUtil.neutralize(event);

    this._openEditModal();
  }

  /**
   * Open edit modal.
   */
  private _openEditModal(): void {
    this.modalService.open(EditProjectModalComponent, {
      data: this.data,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this.projectEdited.emit(res);
        }
      },
    });
  }
}
