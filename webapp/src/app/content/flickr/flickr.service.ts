import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FlickrService {

  constructor(private http: HttpClient) {
  }

  public getPhotos(disease: string): Observable<string> {
    return this.http.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2508b7cca5ebc9f8b29f9426e45e05a3&text=${disease}&per_page=10&privacy_filter=1`, {responseType: 'text'});
  }
}
