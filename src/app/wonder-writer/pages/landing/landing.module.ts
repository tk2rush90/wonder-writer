import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import {IconModule} from '@tk-ui/components/icon/icon.module';
import {FlatButtonModule} from '@tk-ui/components/flat-button/flat-button.module';


@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    IconModule,
    FlatButtonModule
  ]
})
export class LandingModule { }
