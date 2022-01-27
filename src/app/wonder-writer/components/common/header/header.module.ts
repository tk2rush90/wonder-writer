import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import {IconButtonModule} from '../icon-button/icon-button.module';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IconButtonModule,
    RouterModule
  ]
})
export class HeaderModule { }
