import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {MerkezbankPage} from "../pages/merkezbank/merkezbank";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  mainPage: {title: string, component:any};
  bankPages: Array<{title: string, component:any}>;
  toolsPages: Array<{title: string, component:any}>;


  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.mainPage = {title: "Özet", component: HomePage};

    this.bankPages = [
      {title: "Merkez Bankası", component: MerkezbankPage}
    ];

    this.toolsPages = [
      {title: "Kur Dönüştürücü", component: null}, // todo add component
      {title: "Hakkında", component: null}, // todo add component
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
