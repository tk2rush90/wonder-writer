import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';

@Component({
  selector: 'app-delete-directory-modal',
  templateUrl: './delete-directory-modal.component.html',
  styleUrls: ['./delete-directory-modal.component.scss']
})
export class DeleteDirectoryModalComponent implements OnInit {

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<DeleteDirectoryModalComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Close modal with response.
   * @param res response
   */
  close(res?: boolean) {
    this.modalRef.close(res);
  }
}
