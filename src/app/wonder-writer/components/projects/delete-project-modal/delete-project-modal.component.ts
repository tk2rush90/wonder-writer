import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';

@Component({
  selector: 'app-delete-project-modal',
  templateUrl: './delete-project-modal.component.html',
  styleUrls: ['./delete-project-modal.component.scss']
})
export class DeleteProjectModalComponent implements OnInit {

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<DeleteProjectModalComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Close current modal.
   * @param res response
   */
  close(res?: boolean): void {
    this.modalRef.close(res);
  }
}
