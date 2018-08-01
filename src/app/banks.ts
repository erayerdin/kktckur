import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ElementCompact, xml2js} from "xml-js";
import {normalizeRawText} from "./utils";
import {AlertController, LoadingController} from "ionic-angular";
import {parse, stringify} from "circular-json";

export class Currency {
  label: string;
  value: number;

  constructor(
    label: string,
    value: number,
    private buyValue: number = 0,
    private sellValue: number = 0,
    private forexBuyValue: number = 0,
    private forexSellValue: number = 0
  ) {
    this.label = label;
    this.value = value;
  }

  buy(): number {
    return this.value * this.buyValue;
  }

  sell(): number {
    return this.value * this.sellValue;
  }

  forexBuy(): number {
    return this.value * this.forexBuyValue;
  }

  forexSell(): number {
    return this.value * this.forexSellValue;
  }
}

export abstract class Bank {
  static label: string;
  label: string;
  http: HttpClient;
  failed: boolean;

  abstract fetchData();
  abstract parseData(data: ElementCompact);
  abstract reset();
}

@Injectable()
export class KKTCMerkezBankProvider extends Bank {
  static label: string = "KKTC Merkez Bankası";
  // label: string;
  currencies: Currency[] = [];
  // failed: boolean;

  private url: string = "http://cors-anywhere.herokuapp.com/http://185.64.80.30/kur/gunluk.xml";

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
    super();
    this.failed = false;
    this.label = KKTCMerkezBankProvider.label;
    // this.fetchData();
  }

  toJSON() {
    return {label: this.label, failed: this.failed, currencies: this.currencies, url: this.url};
  } // Avoiding JSON.stringify method's circular structure error

  fetchData() {
    const headers = {};
    const options = {
      responseType: "text",
      headers: headers
    };
    // @ts-ignore
    this.http.get(this.url, options).subscribe(
      (response) => {
        const data = xml2js(response, {nativeType: true, compact: true});
        this.parseData(data["KKTCMB_Doviz_Kurlari"]["Resmi_Kurlar"]["Resmi_Kur"]);
      },
      (response) => {
        const alert = this.alertCtrl.create({
          title: "Bağlanılamadı.",
          message: "Bağlantıda sorun oluştu. Lütfen daha sonra tekrar deneyin.",
          buttons: ["Tamam"]
        });
        alert.present();
        this.failed = true;
      }
    );
  }

  parseData(data: ElementCompact) {
    for (let i=0 ; i < data.length ; i++) {
      let obj: object = data[i];

      const value = obj["Birim"]._text;
      const label = normalizeRawText(obj["Isim"]._text);
      const buy = obj["Doviz_Alis"]._text;
      const sell = obj["Doviz_Satis"]._text;
      const forexBuy = obj["Efektif_Alis"]._text;
      const forexSell = obj["Efektif_Satis"]._text;

      const currency = new Currency(label, value, buy, sell, forexBuy, forexSell);
      this.currencies.push(currency);
    }
  }

  reset() {
    this.currencies = [];
    this.failed = false;
  }
}

export enum RatioType {
  BUY = "Alış",
  SELL = "Satış",
  FOREX_BUY = "Efektif Alış",
  FOREX_SELL = "Efektif Satış"
}

@Injectable()
export class BanksProvider {
  bankProviders: Bank[];
  selectedBank: Bank;
  selectedCurrency: Currency;
  ratioType: RatioType;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private KKTCMerkezBank: KKTCMerkezBankProvider) {
    this.bankProviders = [this.KKTCMerkezBank];
  }

  fetchBankData() {
    let loading = this.loadingCtrl.create({
      content: "Veriler alınıyor..."
    });
    loading.present();

    this.selectedBank.reset();
    this.selectedBank.fetchData();

    if (this.selectedBank.failed) {
      let alert = this.alertCtrl.create({
        title: "Bağlantı Sorunu",
        message: "Bankaya bağlantı sağlanamadı."
      });
      alert.onDidDismiss(() => {
        this.reset();
      });
      alert.present();
    }

    loading.dismiss();

    loading = this.loadingCtrl.create({
      content: "Kur bilgileri alınıyor...",
      duration: 500
    });
    loading.present(); // doesn't get currencies immediately
    this.ratioType = RatioType.BUY;
  }

  setCurrency() {
    let loading = this.loadingCtrl.create({
      content: "Kur bilgileri alınıyor...",
      duration: 1000
    });
    loading.present();

    this.ratioType = RatioType.BUY;
  }

  reset() {
    let loading = this.loadingCtrl.create({
      content: "Veriler sıfırlanıyor...",
      duration: 500
    });
    loading.present();

    this.selectedBank = null;
  }
}

@Injectable()
export class CurrencyCalculatorProvider {
  formerValue: number;
  latterValue: number;
  ratio: number;

  calculateLatter() {
    this.latterValue = this.formerValue * this.ratio;
  }

  calculateFormer() {
    this.formerValue = this.latterValue / this.ratio;
  }
}
