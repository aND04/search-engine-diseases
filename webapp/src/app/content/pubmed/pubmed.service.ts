import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, forkJoin} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PubmedService {

  constructor(private http: HttpClient) {
  }

  public getArticleIds(disease: string): Observable<string> {
    return this.http.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${disease}&retmax=10&retmode=xml`, {responseType: 'text'});
  }

  public getArticles(ids: string): Observable<string> {
    return this.http.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=text&rettype=xml`, {responseType: 'text'});
  }

  public getAbstractMentions(abstracts: Array<string>): Observable<any> {
      const newArray = abstracts.map(article => {
        const encodedText = encodeURIComponent(article);
        return this.http.get(`http://labs.rd.ciencias.ulisboa.pt/mer/api.php?lexicon=doid&text=${encodedText}`, {responseType: 'text'});
      });
      return forkJoin(newArray);
  }
}
