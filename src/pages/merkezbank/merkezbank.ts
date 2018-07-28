import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Currency, KKTCMerkezBankProvider} from "../../app/banks";

@Component({
  selector: 'page-merkezbank',
  templateUrl: 'merkezbank.html'
})
export class MerkezbankPage {
  currencies: Currency[];

  constructor(public navCtrl: NavController, private bank: KKTCMerkezBankProvider) {}
}
