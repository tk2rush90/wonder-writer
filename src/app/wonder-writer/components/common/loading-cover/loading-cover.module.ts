import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingCoverComponent} from './loading-cover.component';
import {LoadingSpinnerModule} from '@tk-ui/components/loading-spinner/loading-spinner.module';


@NgModule({
  declarations: [
    LoadingCoverComponent
  ],
  exports: [
    LoadingCoverComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule
  ]
})
export class LoadingCoverModule {
}
