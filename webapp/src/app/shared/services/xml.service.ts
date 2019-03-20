import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlService {

  constructor() { }

  public parseXmlString(xmlString: string): Document {
    return new DOMParser().parseFromString(xmlString, "text/xml");
  }

  public getXpathContent(xmlString: string, xpath: string): Array<string> {
    let array: Array<string> = [];
    const doc: Document = this.parseXmlString(xmlString);
    const xPathResult = doc.evaluate(xpath, doc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    let thisNode = xPathResult.iterateNext();
    while(thisNode) {
      array.push(thisNode.textContent);
      thisNode = xPathResult.iterateNext();
    }
    return array;
  }
}
