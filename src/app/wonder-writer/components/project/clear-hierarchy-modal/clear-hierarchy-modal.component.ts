import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';

@Component({
  selector: 'app-clear-hierarchy-modal',
  templateUrl: './clear-hierarchy-modal.component.html',
  styleUrls: ['./clear-hierarchy-modal.component.scss']
})
export class ClearHierarchyModalComponent implements OnInit {

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<ClearHierarchyModalComponent>,
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
