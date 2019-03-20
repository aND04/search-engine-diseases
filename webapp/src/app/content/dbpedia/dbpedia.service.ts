import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DbpediaService {

  constructor(private http: HttpClient) {
  }

  public getDiseases(medicalSpecialty: string): Observable<any> {
    medicalSpecialty = medicalSpecialty.charAt(0).toUpperCase() + medicalSpecialty.substring(1);
    return this.http.get(`http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A${medicalSpecialty}+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fxml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\\`,
      {responseType: 'text'});
  }
}
