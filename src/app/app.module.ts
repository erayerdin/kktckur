import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Network} from "@ionic-native/network";
import {HttpClientModule} from "@angular/common/http";
import {MerkezbankPage} from "../pages/merkezbank/merkezbank";
import {TransformerPage} from "../pages/transformer/transformer";
import {TitlifyPipe} from "./utils";
import {KKTCMerkezBankProviderService} from "./services/bank";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MerkezbankPage,
    TransformerPage,

    // Pipes
    TitlifyPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MerkezbankPage,
    TransformerPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    KKTCMerkezBankProviderService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
