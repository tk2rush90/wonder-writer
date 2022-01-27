import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ProjectItem} from '../../../../models/project-item';

@Component({
  selector: 'app-project-logo',
  templateUrl: './project-logo.component.html',
  styleUrls: ['./project-logo.component.scss']
})
export class ProjectLogoComponent implements OnInit {
  // Project item model.
  @Input() data!: ProjectItem;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Bind the `theme` property as background color style.
   */
  @HostBinding('style.background-color') get backgroundColor(): string {
    return this.data.theme as string;
  }

  /**
   * Return the first letter of project name.
   */
  get firstLetter(): string {
    return this.data.name[0];
  }
}
