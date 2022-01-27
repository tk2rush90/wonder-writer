import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectDetailContainer} from '@wonder-writer/pages/writer/project-detail-container/project-detail-container';

@NgModule({
  declarations: [
    ProjectDetailContainer,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ProjectDetailContainer,
  ]
})
export class ProjectDetailContainerModule {
}
