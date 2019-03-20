import {Component} from '@angular/core';
import {DbpediaService} from "./dbpedia.service";
import {DiseaseService} from "../../shared/services/disease.service";
import {XmlService} from "../../shared/services/xml.service";

@Component({
  selector: 'app-dbpedia',
  templateUrl: './dbpedia.component.html',
  styleUrls: ['./dbpedia.component.scss']
})
export class DbpediaComponent {

  public medicalSpecialty: string;
  public diseases: Array<string> = [];

  constructor(private dbpediaService: DbpediaService,
              private diseaseService: DiseaseService,
              private xmlService: XmlService) {
  }

  public onSubmit() {
    this.dbpediaService.getDiseases(this.medicalSpecialty).subscribe(res => {
      this.setDiseases(res);
    });
  }

  public onClick(disease: string) {
    this.diseaseService.next(disease);
  }

  private setDiseases(xmlString: string) {
    const data = this.xmlService.getXpathContent(xmlString, '//*[@name="name"]');
    const didDataChange: boolean = JSON.stringify(this.diseases) !== JSON.stringify(data);
    if (didDataChange) {
      this.diseases = data;
    }
  }
}
