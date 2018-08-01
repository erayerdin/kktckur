import {Injectable} from "@angular/core";
import {AlertController, LoadingController} from "ionic-angular";
import {ElementCompact, xml2js} from "xml-js";
import * as _ from "underscore";
import {HttpClient} from "@angular/common/http";
import {parse, stringify} from "circular-json";
import {normalizeRawText} from "../utils";

abstract class Bank {
  label: string;
  data: string | {} | {}[];
  // dataType: DataType;
  url: string;

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected loadingCtrl: LoadingController) {}

  abstract fetchData();
  abstract reset();
}

@Injectable()
export class KKTCMerkezBankProviderService extends Bank {
  label = "KKTC Merkez Bankası";
  data: {
    Birim: number,
    Sembol: string,
    Isim: string,
    Doviz_Alis: number,
    Doviz_Satis: number,
    Efektif_Alis: number,
    Efektif_Satis
  }[];
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
          let obj = {};
          obj["Birim"] = d["Birim"]._text;
          obj["Sembol"] = d["Sembol"]._text;
          obj["Isim"] = normalizeRawText(d["Isim"]._text);
          obj["Doviz_Alis"] = d["Doviz_Alis"]._text;
          obj["Doviz_Satis"] = d["Doviz_Satis"]._text;
          obj["Efektif_Alis"] = d["Efektif_Alis"]._text;
          obj["Efektif_Satis"] = d["Efektif_Satis"]._text;
          // @ts-ignore
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
