import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';

@Component({
  selector: 'app-delete-relation-modal',
  templateUrl: './delete-relation-modal.component.html',
  styleUrls: ['./delete-relation-modal.component.scss']
})
export class DeleteRelationModalComponent implements OnInit {

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<DeleteRelationModalComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Close with result
   * @param res result
   */
  close(res?: boolean): void {
    this.modalRef.close(res);
  }

}
