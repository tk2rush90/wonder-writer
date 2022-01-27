import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectListComponent} from './project-list.component';
import {ProjectItemComponent} from './project-item/project-item.component';
import {ProjectLogoComponent} from './project-logo/project-logo.component';
import {IconButtonModule} from '../../common/icon-button/icon-button.module';
import {DeleteProjectModalModule} from '../delete-project-modal/delete-project-modal.module';
import {EditProjectModalModule} from '../edit-project-modal/edit-project-modal.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    ProjectLogoComponent
  ],
  exports: [
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    IconButtonModule,
    DeleteProjectModalModule,
    EditProjectModalModule,
    RouterModule,
  ]
})
export class ProjectListModule {
}
