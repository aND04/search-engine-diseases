import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {
  private readonly currentDisease: BehaviorSubject<string> = new BehaviorSubject(null);
  public disease$: Observable<string> = this.currentDisease.asObservable();

  constructor() {
  }

  public next(disease: string) {
    this.currentDisease.next(disease);
  }
}
