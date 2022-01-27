import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriterRoutingModule } from './writer-routing.module';
import { WriterComponent } from './writer.component';
import {HeaderModule} from '../../components/common/header/header.module';


@NgModule({
  declarations: [
    WriterComponent
  ],
  imports: [
    CommonModule,
    WriterRoutingModule,
    HeaderModule
  ]
})
export class WriterModule { }
