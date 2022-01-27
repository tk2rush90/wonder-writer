import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateDirectoryModalComponent} from './create-directory-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {FormFieldModule} from '@tk-ui/components/form-field/form-field.module';
import {SingleTextFormModule} from '../../common/single-text-form/single-text-form.module';


@NgModule({
  declarations: [
    CreateDirectoryModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FlatButtonModule,
    FormFieldModule,
    SingleTextFormModule
  ],
  exports: [
    CreateDirectoryModalComponent,
  ]
})
export class CreateDirectoryModalModule {
}
