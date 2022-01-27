import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProjectSettingsRoutingModule} from './project-settings-routing.module';
import {ProjectSettingsComponent} from './project-settings.component';
import {SelectModule} from '@tk-ui/components/select/select.module';
import {
  ProjectDetailContainerModule
} from '@wonder-writer/pages/writer/project-detail-container/project-detail-container.module';
import {FormsModule} from '@angular/forms';
import {RangeSliderModule} from '@wonder-writer/components/common/range-slider/range-slider.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    ProjectSettingsComponent
  ],
  imports: [
    CommonModule,
    ProjectSettingsRoutingModule,
    SelectModule,
    ProjectDetailContainerModule,
    FormsModule,
    RangeSliderModule,
    InputModule,
    FlatButtonModule,
  ]
})
export class ProjectSettingsModule {
}
