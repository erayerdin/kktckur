import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ElementCompact, xml2js} from "xml-js";
import {normalizeRawText} from "./utils";
import {AlertController} from "ionic-angular";

export interface Bank {
  fetchData();
  parseData(data: Document);
}

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

@Injectable()
export class KKTCMerkezBankProvider implements Bank {
  label: string = "KKTC Merkez Bankası";
  currencies: Currency[] = [];
  failed: boolean;

  private url: string = "http://185.64.80.30/kur/gunluk.xml";

  constructor(private http: HttpClient, public alertCtrl: AlertController) {
    this.failed = false;
    this.fetchData();
  }

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
}
