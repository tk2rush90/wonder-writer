import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {HierarchyItem} from '../../../models/hierarchy-item';
import {HierarchyUtil} from '../../../utils/hierarchy.util';

@Component({
  selector: 'app-delete-hierarchy-modal',
  templateUrl: './delete-hierarchy-modal.component.html',
  styleUrls: ['./delete-hierarchy-modal.component.scss']
})
export class DeleteHierarchyModalComponent implements OnInit {
  // Type label
  typeLabel!: string;

  // Message
  message!: string;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<DeleteHierarchyModalComponent>,
    // Hierarchy item to delete.
    @Inject(MODAL_DATA) private data: HierarchyItem,
  ) {
  }

  ngOnInit(): void {
    this._setTexts();
  }

  /**
   * Set text variables
   */
  private _setTexts(): void {
    this.typeLabel = HierarchyUtil.getTypeLabel(this.data.type);
    this.message = HierarchyUtil.getDeleteConfirmMessage(this.data.type);
  }

  /**
   * Close modal with response.
   * @param res response
   */
  close(res?: boolean) {
    this.modalRef.close(res);
  }
}
