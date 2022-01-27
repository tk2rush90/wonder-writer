import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';
import {CreateProjectModalComponent} from '../create-project-modal/create-project-modal.component';
import {ProjectItem} from '../../../models/project-item';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss']
})
export class SearchHeaderComponent implements OnInit {
  // Project search text.
  @Input() search = '';

  // Search change emitter.
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  // Project created emitter.
  @Output() projectCreated: EventEmitter<ProjectItem> = new EventEmitter<ProjectItem>();

  constructor(
    private modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Open create modal
   */
  openCreateModal(): void {
    this.modalService.open(CreateProjectModalComponent, {
      closeOnNavigating: true,
      onClose: (result?: ProjectItem) => {
        if (result) {
          this.projectCreated.emit(result);
        }
      },
    });
  }
}
