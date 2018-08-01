import {Pipe, PipeTransform} from "@angular/core";

export function normalizeRawText(text: string): string {
  text = text.replace(/Ã/g, "Ç");
  text = text.replace(/Ã‡/g, "Ç");
  text = text.replace(/"Ä/g, "Ğ");
  text = text.replace(/Ä°/g, "İ");
  text = text.replace(/Ã/g, "Ö");
  text = text.replace(/Å/g, "Ş");
  text = text.replace(/Ã/g, "Ü");
  text = text.replace(/Ã§/g, "ç");
  text = text.replace(/Ä/g, "ğ");
  text = text.replace(/Ä±/g, "ı");
  text = text.replace(/Ã¶/g, "ö");
  text = text.replace(/Å/g, "ş");
  text = text.replace(/Ã¼/g, "ü");
  return text;
}

// Pipes //
@Pipe({name: "titlify"})
export class TitlifyPipe implements PipeTransform {
  transform(value: string): string {
    let lower = value.toLocaleLowerCase();
    let splitted = lower.split(" ");

    for (let i=0 ; i < splitted.length ; i++) {
      let part = splitted[i];
      let firstChar = part.charAt(0).toLocaleUpperCase();
      part = firstChar + part.substr(1);
      splitted[i] = part;
    }

    let result: string = splitted.join(" ");
    return result;
  }
}
