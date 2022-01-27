import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchHeaderComponent} from './search-header.component';
import {SearchProjectsComponent} from './search-projects/search-projects.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {CreateProjectModalModule} from '../create-project-modal/create-project-modal.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SearchHeaderComponent,
    SearchProjectsComponent
  ],
  exports: [
    SearchHeaderComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    FlatButtonModule,
    CreateProjectModalModule,
    FormsModule,
  ]
})
export class SearchHeaderModule {
}
