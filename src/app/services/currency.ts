import {Injectable} from "@angular/core";
import {AlertController, LoadingController} from "ionic-angular";
import * as _ from "underscore";
import {HttpClient} from "@angular/common/http";
import {ElementCompact, xml2js} from "xml-js";
import {normalizeRawText} from "../utils";

export class Currency {
  value: number;
  ratios: {
    buyRatio: number,
    sellRatio: number,
    effectiveBuyRatio?: number,
    effectiveSellRatio?: number
  } = {
    buyRatio: null,
    sellRatio: null,
    effectiveBuyRatio: null,
    effectiveSellRatio: null
  };

  humanReadableName: string;
  computerReadableName: string;

  constructor() {}
}

export abstract class CurrencyService {
  label: string;
  data: Currency[];
  url: string;

  selectedCurrency: Currency;
  selectedRatioType: number;

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected loadingCtrl: LoadingController) {
    this.selectedRatioType = 0;
  }

  abstract fetchData();
  abstract reset();

  toJSON() {
    return {
      label: this.label,
      data: this.data,
      url: this.url,
      selectedCurrency: this.selectedCurrency
    }
  }

  computeValue(event: Event) {

  }

  computeBuyRatio(event: Event) {

  }

  computeSellRatio(event: Event) {

  }

  computeEffectiveBuyValue(event: Event) {

  }

  computeEffectiveSellValue(event: Event) {

  }
}

@Injectable()
export class KKTCMerkezBankCurrencyService extends CurrencyService {
  label = "KKTC Merkez Bankası";
  url = "http://cors-anywhere.herokuapp.com/http://185.64.80.30/kur/gunluk.xml";
  httpOptions: {} = {
    responseType: "text"
  };

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected loadingCtrl: LoadingController) {
    super(httpClient, alertCtrl, loadingCtrl);
  }

  fetchData() {
    const loading = this.loadingCtrl.create({
      content: "Veriler alınıyor..."
    });
    loading.present();

    this.httpClient.get(this.url, this.httpOptions).subscribe(
      (response: string) => {
        const data: ElementCompact = xml2js(response, {nativeType: true, compact: true});
        const focalData: ElementCompact[] = data["KKTCMB_Doviz_Kurlari"]["Resmi_Kurlar"]["Resmi_Kur"];

        this.data = [];
        _.each(focalData, (d) => {
          let obj = new Currency();
          obj.value = d["Birim"]._text;
          obj.computerReadableName = d["Sembol"]._text;
          obj.humanReadableName = normalizeRawText(d["Isim"]._text);
          obj.ratios.buyRatio = d["Doviz_Alis"]._text;
          obj.ratios.sellRatio = d["Doviz_Satis"]._text;
          obj.ratios.effectiveBuyRatio = d["Efektif_Alis"]._text;
          obj.ratios.effectiveSellRatio = d["Efektif_Satis"]._text;
          this.data.push(obj);
        });

        loading.dismiss();
      },
      (response) => {
        loading.dismiss();

        const alert = this.alertCtrl.create({
          title: "Bağlantı Sorunu",
          message: `Verileri almak için "${this.label}" servisine bağlanılamadı. Daha sonra tekrar deneyin.`,
          buttons: [{text:"Tamam"}]
        });

        alert.present();
      }
    );
  }

  reset() {
    this.selectedCurrency = null;
    this.data = null;
  }
}
