import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CurrencyService, KKTCMerkezBankCurrencyService} from "../../app/services/currency";

@Component({
  selector: 'page-transformer',
  templateUrl: 'transformer.html',
  providers: [KKTCMerkezBankCurrencyService]
})
export class TransformerPage {
  currencyServices: CurrencyService[];
  selectedCurrencyService: CurrencyService;

  constructor(
    public navCtrl: NavController,
    protected kktcMerkezBankCurrencyService: KKTCMerkezBankCurrencyService
  ) {
    this.currencyServices = [this.kktcMerkezBankCurrencyService];
  }
}
