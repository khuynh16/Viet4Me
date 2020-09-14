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
  private filterCategoriesSubject = new Subject<any>();
  private filterViaTextSubject = new Subject<any>();

  public userTextFilterUpdated = new Subject<string>();

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

  changeFilterCategoriesEvent() {
    this.filterCategoriesSubject.next();
  }

  getFilterCategoriesStatus(): Observable<any> {
    return this.filterCategoriesSubject.asObservable();
  }



  changeFilterTextEvent() {
    this.filterViaTextSubject.next();
  }

  getFilterTextStatus(): Observable<any> {
    return this.filterViaTextSubject.asObservable();
  }


  getFilterUserInputListener() {
    return this.userTextFilterUpdated.asObservable();
  }
}
