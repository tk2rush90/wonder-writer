import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SingleTextFormComponent} from './single-text-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormFieldModule} from '@tk-ui/components/form-field/form-field.module';
import {InputModule} from '@tk-ui/components/input/input.module';
import {AutoFocusModule} from '@tk-ui/components/auto-focus/auto-focus.module';


@NgModule({
  declarations: [
    SingleTextFormComponent
  ],
  exports: [
    SingleTextFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldModule,
    InputModule,
    AutoFocusModule
  ]
})
export class SingleTextFormModule {
}
