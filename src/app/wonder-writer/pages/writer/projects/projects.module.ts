import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {SearchHeaderModule} from '../../../components/projects/search-header/search-header.module';
import {ProjectListModule} from '../../../components/projects/project-list/project-list.module';


@NgModule({
  declarations: [
    ProjectsComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SearchHeaderModule,
    ProjectListModule
  ]
})
export class ProjectsModule { }
