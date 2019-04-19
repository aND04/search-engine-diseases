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
  public mentions: Array<string>;

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

      //crio novo array com title e abstract juntos
      const completeArticles = titles.map(function(articleTitle, index) {
        const joinedText = `${articleTitle} ${abstracts[index]}`;
        return joinedText.replace(/\s\s+/g, ' ');
      });
      this.setMer(completeArticles);
    });
  }

  private setMer(abstracts: Array<string>) {
    this.pubmedService.getAbstractMentions(abstracts).subscribe((results)=> {
      this.mentions = results.map(result => {
        const transformresult = this.csvToJS(result);
        //Anna, podes aplicar aqui a função para o count
        return this.filterDiseaseMention(transformresult);
      });
    });
  }

  //Converte o resultado do MER, que vem em CSV, num array para se poder processar a informação
  private csvToJS(csv) {
      const lines = csv.split("\n");
      const diseaseIndex = 2;

      if (lines.length > 1 && lines[lines.length-1] === "") {
          lines.pop();
      }

      return lines.map(line => {
        const arrayFromSpacing = line.replace(/\s+/g,' ').toLowerCase().split(' ');

        if (arrayFromSpacing.length > 4) {
            return arrayFromSpacing.reduce(
              (accumulator, currentValue, index, originalArray) => {
                if(index > diseaseIndex && index < originalArray.length -1) {
                    accumulator[diseaseIndex] = `${accumulator[diseaseIndex]} ${currentValue}`
                } else {
                    accumulator.push(currentValue);
                }
                return accumulator;
              },
            []);
        }
        return arrayFromSpacing;
      });
    };

    //pega no array de diseases que vem do MER, já transformado, e filtra para que só apareça uma doença por artigo
    private filterDiseaseMention(diseases) {
      const diseaseIndex = 2;
      let filterRepeated = [];

      diseases.forEach((disease, index)  => {
          const checkIfExists = filterRepeated.some(diseaseReference => {
              return diseaseReference.indexOf(disease[diseaseIndex]) !== -1;
          });
          if (!checkIfExists) {
              filterRepeated.push(disease);
          }
      });

      //retorna objecto formatado para preencher o elemento <a>
      return filterRepeated.map((disease, index) => {
          if (disease[0] !== "") {
              return {
                url: disease[disease.length -1],
                text: disease[diseaseIndex]
              }
          }
          return {};
      });
    }
}
