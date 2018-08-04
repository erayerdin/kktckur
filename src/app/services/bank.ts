import {Injectable} from "@angular/core";
import {AlertController, LoadingController} from "ionic-angular";
import {ElementCompact, xml2js} from "xml-js";
import * as _ from "underscore";
import {HttpClient} from "@angular/common/http";
import {parse, stringify} from "circular-json";
import {normalizeRawText} from "../utils";
import {Currency} from "./currency";

export abstract class BankService {
  label: string;
  data: Currency[];
  // dataType: DataType;
  url: string;

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected loadingCtrl: LoadingController) {}

  abstract fetchData();
  abstract reset();

  toJSON() {
    return {
      label: this.label,
      data: this.data,
      url: this.url
    }; // quick dirty fix for circular reference
  }
}

@Injectable()
export class KKTCMerkezBankProviderService extends BankService {
  label = "KKTC Merkez Bankası";
  public data: Currency[];
  url = "http://cors-anywhere.herokuapp.com/http://185.64.80.30/kur/gunluk.xml";
  httpOptions: {} = {
    responseType: "text"
  };

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController) {
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
    this.data = null;
  }
}
