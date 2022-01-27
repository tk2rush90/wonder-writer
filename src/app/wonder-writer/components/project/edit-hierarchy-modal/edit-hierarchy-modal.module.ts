import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditHierarchyModalComponent} from './edit-hierarchy-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {SingleTextFormModule} from '../../common/single-text-form/single-text-form.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    EditHierarchyModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    SingleTextFormModule,
    FlatButtonModule
  ]
})
export class EditHierarchyModalModule {
}
