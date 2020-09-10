import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  public currentExpandState: string;

  constructor() { }

  private expandSubject = new Subject<any>();
  private langSubject = new Subject<any>();

  changeExpandEvent() {
    this.expandSubject.next();
  }

  getExpandStatus(): Observable<any>{
    return this.expandSubject.asObservable();
  }

  changeLangEvent() {
    this.langSubject.next();
  }

  getLangStatus(): Observable<any>{
    return this.langSubject.asObservable();
  }
}
