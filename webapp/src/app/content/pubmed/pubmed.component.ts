import { Component, OnInit } from '@angular/core';
import {DiseaseService} from "../../shared/services/disease.service";
import {PubmedService} from "./pubmed.service";
import {XmlService} from "../../shared/services/xml.service";

@Component({
  selector: 'app-pubmed',
  templateUrl: './pubmed.component.html',
  styleUrls: ['./pubmed.component.scss']
})
export class PubmedComponent implements OnInit {

  public disease: string;
  public articleIds: string;

  public titles: Array<string>;
  public abstracts: Array<string>;

  constructor(private diseaseService: DiseaseService,
              private pubmedService: PubmedService,
              private xmlService: XmlService) { }

  ngOnInit() {
    this.diseaseService.disease$.subscribe(disease => {
      this.disease = disease;
      this.pubmedService.getArticleIds(this.disease).subscribe(res => this.setArticles(res));
    });
  }

  private setArticleIds(xmlString: string) {
    const data = this.xmlService.getXpathContent(xmlString, '//Id');
    const didDataChange: boolean = JSON.stringify(this.articleIds) !== JSON.stringify(data);
    if (didDataChange) {
      data.forEach(item => {
        if (item != 'undefined') this.articleIds += item + ',';
      });
      // remove undefined and trailing comma
      this.articleIds = this.articleIds.substring(9, this.articleIds.length - 2);
      console.log(this.articleIds);
    }
  }

  private setArticles(xmlString: string) {
    this.setArticleIds(xmlString);
    this.pubmedService.getArticles(this.articleIds).subscribe(res => {
      const titles = this.xmlService.getXpathContent(res, '//ArticleTitle');
      this.titles = titles;
      const abstracts = this.xmlService.getXpathContent(res, '//Abstract');
      this.abstracts = abstracts;
    });
  }
}
