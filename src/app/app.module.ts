import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastModule} from '@tk-ui/components/toast/toast.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ModalModule} from '@tk-ui/components/modal/modal.module';
import {LoadingCoverModule} from './wonder-writer/components/common/loading-cover/loading-cover.module';
import {RouterProgressModule} from '@tk-ui/components/router-progress/router-progress.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastModule,
    BrowserAnimationsModule,
    ModalModule,
    LoadingCoverModule,
    RouterProgressModule,
  ],
  providers: [
    SubscriptionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
