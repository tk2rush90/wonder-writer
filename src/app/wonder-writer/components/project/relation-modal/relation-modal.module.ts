import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RelationModalComponent} from './relation-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {FormFieldModule} from '@tk-ui/components/form-field/form-field.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {SelectModule} from '@tk-ui/components/select/select.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    RelationModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FlatButtonModule,
    FormFieldModule,
    InputModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RelationModalComponent,
  ]
})
export class RelationModalModule {
}
