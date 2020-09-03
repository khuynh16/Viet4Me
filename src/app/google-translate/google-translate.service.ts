import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GoogleObj } from './translate.model';

@Injectable({providedIn: 'root'})
export class GoogleTranslateService {

  url = 'https://translation.googleapis.com/language/translate/v2?key=';
  key = 'AIzaSyApGKmws2xlvDwZL45ayLqRgdQJ9vLu4oE';

  constructor(private http: HttpClient) { }

  translate(obj: GoogleObj) {
    return this.http.post(this.url + this.key, obj);
  }
}

