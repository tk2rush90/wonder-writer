import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProjectRoutingModule} from './project-routing.module';
import {ProjectComponent} from './project.component';
import {HierarchiesModule} from '../../../components/project/hierarchies/hierarchies.module';
import {DocumentModule} from '../../../components/project/document/document.module';
import {
  ProjectDetailContainerModule
} from '@wonder-writer/pages/writer/project-detail-container/project-detail-container.module';


@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    HierarchiesModule,
    DocumentModule,
    ProjectDetailContainerModule,
  ]
})
export class ProjectModule {
}
