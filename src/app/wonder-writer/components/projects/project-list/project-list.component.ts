import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectItem} from '../../../models/project-item';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  // Project list data.
  @Input() data: ProjectItem[] = [];

  // Project deleted emitter.
  @Output() projectDeleted: EventEmitter<ProjectItem> = new EventEmitter<ProjectItem>();

  // Project edited emitter.
  @Output() projectEdited: EventEmitter<ProjectItem> = new EventEmitter<ProjectItem>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
