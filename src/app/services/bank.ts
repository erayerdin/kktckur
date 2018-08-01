import {Injectable} from "@angular/core";
import {AlertController, LoadingController} from "ionic-angular";
import {ElementCompact} from "xml-js";
import * as _ from "underscore";

// export enum DataType {
//   XML,
//   JSON
// }

/**
 * All properties that is not intended to be searched through the XML should start with
 * an underscore so that parseElement function can filter what is in the XML and what is
 * not.
 */
abstract class Data {
  _computerReadableName: string
  _humanReadableName: string
  _buyExchangeRate: number
  _sellExchangeRate: number
  _effectiveBuyExchangeRate: number
  _effectiveSellExchangeRate: number

  constructor(element: ElementCompact) {
    this.parseElement(element);
  }

  /**
   * This function takes properties into consideration except it starts with underscore.
   */
  protected parseElement(element: ElementCompact): void {
    const allProperties: string[] = Object.getOwnPropertyNames(this);
    // @ts-ignore
    const properties: string[] = _.reject(allProperties, (prop) => prop.charAt(0) === "_");

    _.each(properties, (prop: string) => {
      let val: string | number = element[prop]._text;
      this[prop] = val;
    });
  };
}

abstract class Bank {
  label: string;
  data: string | {} | {}[];
  // dataType: DataType;
  url: string;

  constructor(protected alertCtrl: AlertController, protected loadingCtrl: LoadingController) {}

  abstract fetchData();
}

////////////////////
// KKTCMerkezBank //
////////////////////
export class KKTCMerkezBankData extends Data {
  Birim: number
  Sembol: string
  Isim: string
  Doviz_Alis: number
  Doviz_Satis: number
  Efektif_Alis: number
  Efektif_Satis: number

  protected parseElement(element: ElementCompact) {
    super.parseElement(element);

    this._humanReadableName = this["Isim"];
    this._computerReadableName = this["Sembol"];
    this._buyExchangeRate = this["Doviz_Alis"];
    this._sellExchangeRate = this["Doviz_Satis"];
    this._effectiveBuyExchangeRate = this["Efektif_Alis"];
    this._effectiveSellExchangeRate = this["Efektif_Satis"];
  }
}

@Injectable()
export class KKTCMerkezBank extends Bank {
  label = "KKTC Merkez Bankası";
  data: KKTCMerkezBankData[];
  url = "http://cors-anywhere.herokuapp.com/http://185.64.80.30/kur/gunluk.xml";

  fetchData() {

  }
}
