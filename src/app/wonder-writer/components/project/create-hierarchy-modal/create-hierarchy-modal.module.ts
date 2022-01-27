import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateHierarchyModalComponent} from './create-hierarchy-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {SingleTextFormModule} from '../../common/single-text-form/single-text-form.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    CreateHierarchyModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    SingleTextFormModule,
    FlatButtonModule
  ]
})
export class CreateHierarchyModalModule {
}
