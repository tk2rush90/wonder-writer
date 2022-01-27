import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from './icon-button.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';



@NgModule({
  declarations: [
    IconButtonComponent
  ],
  exports: [
    IconButtonComponent
  ],
  imports: [
    CommonModule,
    IconModule
  ]
})
export class IconButtonModule { }
