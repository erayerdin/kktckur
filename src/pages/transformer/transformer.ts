import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BanksProvider, CurrencyCalculatorProvider, RatioType} from "../../app/banks";

@Component({
  selector: 'page-transformer',
  templateUrl: 'transformer.html',
  providers: [BanksProvider, CurrencyCalculatorProvider]
})
export class TransformerPage {
  constructor(public navCtrl: NavController, private banksProvider: BanksProvider, private currencyCalculatorProvider: CurrencyCalculatorProvider) {}

  changeCurrency() {
    this.currencyCalculatorProvider.formerValue = 1;

    switch (this.banksProvider.ratioType) {
      case RatioType.BUY:
        this.currencyCalculatorProvider.latterValue = this.banksProvider.selectedCurrency.buy();
        this.currencyCalculatorProvider.ratio = this.banksProvider.selectedCurrency.buy();
        break;
      case RatioType.SELL:
        this.currencyCalculatorProvider.latterValue = this.banksProvider.selectedCurrency.sell();
        this.currencyCalculatorProvider.ratio = this.banksProvider.selectedCurrency.sell();
        break;
      case RatioType.FOREX_BUY:
        this.currencyCalculatorProvider.latterValue = this.banksProvider.selectedCurrency.forexBuy();
        this.currencyCalculatorProvider.ratio = this.banksProvider.selectedCurrency.forexBuy();
        break;
      case RatioType.FOREX_SELL:
        this.currencyCalculatorProvider.latterValue = this.banksProvider.selectedCurrency.forexSell();
        this.currencyCalculatorProvider.ratio = this.banksProvider.selectedCurrency.forexSell();
        break;
      default:
        this.currencyCalculatorProvider.latterValue = this.banksProvider.selectedCurrency.buy();
        this.currencyCalculatorProvider.ratio = this.banksProvider.selectedCurrency.buy();
        break;
    }
  }

  changeRatioType() {
    this.changeCurrency();
  }

  // ionViewWillEnter() {
  //   if (this.banksProvider.selectedBank !== undefined) {
  //     this.banksProvider.selectedBank.reset();
  //     this.banksProvider.selectedBank.fetchData();
  //   }
  // }
}
