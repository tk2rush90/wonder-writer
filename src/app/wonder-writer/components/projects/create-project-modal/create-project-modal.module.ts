import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateProjectModalComponent} from './create-project-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {FormFieldModule} from '@tk-ui/components/form-field/form-field.module';
import {AutoFocusModule} from '@tk-ui/components/auto-focus/auto-focus.module';
import {SingleTextFormModule} from '../../common/single-text-form/single-text-form.module';


@NgModule({
  declarations: [
    CreateProjectModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    InputModule,
    FlatButtonModule,
    FormFieldModule,
    AutoFocusModule,
    SingleTextFormModule
  ],
  exports: [
    CreateProjectModalComponent,
  ],
})
export class CreateProjectModalModule {
}
