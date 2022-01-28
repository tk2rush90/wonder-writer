import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteRelationModalComponent} from './delete-relation-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';
import {AutoFocusModule} from '@tk-ui/components/auto-focus/auto-focus.module';


@NgModule({
  declarations: [
    DeleteRelationModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FlatButtonModule,
    AutoFocusModule
  ],
  exports: [
    DeleteRelationModalComponent,
  ]
})
export class DeleteRelationModalModule {
}
