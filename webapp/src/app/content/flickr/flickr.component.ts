import {Component, OnInit} from '@angular/core';
import {FlickrService} from "./flickr.service";
import {XmlService} from "../../shared/services/xml.service";
import {DiseaseService} from "../../shared/services/disease.service";

@Component({
  selector: 'app-flickr',
  templateUrl: './flickr.component.html',
  styleUrls: ['./flickr.component.scss']
})
export class FlickrComponent implements OnInit {

  public disease: string;
  public photoUrls: Array<string> = [];

  constructor(private diseaseService: DiseaseService,
              private flickrService: FlickrService,
              private xmlService: XmlService) {
  }

  ngOnInit() {
    this.diseaseService.disease$.subscribe(disease => {
      this.disease = disease;
      this.flickrService.getPhotos(this.disease).subscribe(res => this.setPhotoUrls(res));
    });
  }

  private setPhotoUrls(xmlString: string) {
    this.photoUrls = [];
    const farmIds = this.xmlService.getXpathContent(xmlString, '//@farm');
    const serverIds = this.xmlService.getXpathContent(xmlString, '//@server');
    const photoIds = this.xmlService.getXpathContent(xmlString, '//@id');
    const secretIds = this.xmlService.getXpathContent(xmlString, '//@secret');
    const length = farmIds.length;

    for (let i = 0; i < length; i++) {
      this.photoUrls.push(`https://farm${farmIds[i]}.staticflickr.com/${serverIds[i]}/${photoIds[i]}_${secretIds[i]}.jpg`);
    }
  }
}
