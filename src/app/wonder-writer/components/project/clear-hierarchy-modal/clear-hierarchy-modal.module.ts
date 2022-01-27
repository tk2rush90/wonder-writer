import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClearHierarchyModalComponent} from './clear-hierarchy-modal.component';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {AutoFocusModule} from '@tk-ui/components/auto-focus/auto-focus.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    ClearHierarchyModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    AutoFocusModule,
    FlatButtonModule
  ],
  exports: [
    ClearHierarchyModalComponent,
  ]
})
export class ClearHierarchyModalModule {
}
