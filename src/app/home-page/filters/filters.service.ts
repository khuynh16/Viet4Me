import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  public currentExpandState: string;

  constructor() { }

  private subject = new Subject<any>();

  sendClickEvent() {
    this.subject.next();
  }

  getExpandStatus(): Observable<any>{
    return this.subject.asObservable();
  }
}
