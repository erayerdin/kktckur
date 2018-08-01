import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {KKTCMerkezBankProviderService} from "../../app/services/bank";

@Component({
  selector: 'page-merkezbank',
  templateUrl: 'merkezbank.html',
  providers: [KKTCMerkezBankProviderService]
})
export class MerkezbankPage {

  constructor(public navCtrl: NavController, protected bankService: KKTCMerkezBankProviderService) {}

  ionViewDidEnter(): void {
    this.bankService.reset();
    this.bankService.fetchData();
  }
}
