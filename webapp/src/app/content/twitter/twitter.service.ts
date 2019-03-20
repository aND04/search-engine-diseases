import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient) {}

  public getTweets(subject: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'OAuth oauth_consumer_key="8wSUS1FdrNyuXKfEnPuOFLOsG",oauth_token="1106575409121034240-s0zdj6CAnzZ2UBFui83NAAy26YA77t",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1552948852",oauth_nonce="E8x7TBpCZaK",oauth_version="1.0",oauth_signature="h49wtR%2BtTH1qR13%2Fpb33dOveHIQ%3D"'
    });
    return this.http.get(`https://api.twitter.com/1.1/search/tweets.json?q=${subject}&result_type=popular`, {headers});
  }
}
