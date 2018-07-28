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
