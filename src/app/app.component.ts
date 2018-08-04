import {Component, ViewChild} from '@angular/core';
import {AlertController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {MerkezbankPage} from "../pages/merkezbank/merkezbank";
import {TransformerPage} from "../pages/transformer/transformer";
import {Network} from "@ionic-native/network";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  mainPage: {title: string, component:any, cssId: string};
  bankPages: Array<{title: string, component:any, cssId: string}>;
  toolsPages: Array<{title: string, component:any, cssId: string}>;


  pages: Array<{title: string, component: any, cssId: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private network: Network, private alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.mainPage = {title: "Özet", component: HomePage, cssId: "home"};

    this.bankPages = [
      {title: "Merkez Bankası", component: MerkezbankPage, cssId: "merkez-bank-page"}
    ];

    this.toolsPages = [
      {title: "Kur Dönüştürücü", component: TransformerPage, cssId: "transformer-page"},
      {title: "Hakkında", component: null, cssId: "about-page"}, // todo add component
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.subscribeToDisconnect();
    });
  }

  subscribeToDisconnect() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      let alert = this.alertCtrl.create({
        title: "Bağlanamadı.",
        message: "İnterenete bağlantı sağlanamıyor.",
        buttons: [{text: "Programı Kapat"}]
      });

      alert.onDidDismiss(() => this.platform.exitApp());
      alert.present();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
