import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditProjectModalComponent} from './edit-project-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {FormFieldModule} from '@tk-ui/components/form-field/form-field.module';
import {AutoFocusModule} from '@tk-ui/components/auto-focus/auto-focus.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {SingleTextFormModule} from '../../common/single-text-form/single-text-form.module';


@NgModule({
  declarations: [
    EditProjectModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormFieldModule,
    AutoFocusModule,
    InputModule,
    FlatButtonModule,
    SingleTextFormModule
  ],
  exports: [
    EditProjectModalComponent,
  ]
})
export class EditProjectModalModule {
}
