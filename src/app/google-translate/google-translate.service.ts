import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GoogleObj } from './translate.model';

import { environment } from '../../../src/environments/environment';

@Injectable({providedIn: 'root'})
export class GoogleTranslateService {

  url = 'https://translation.googleapis.com/language/translate/v2?key=';
  key = environment.GOOGLE_APPLICATION_CREDENTIALS;

  constructor(private http: HttpClient) { }

  translate(obj: GoogleObj) {
    return this.http.post(this.url + this.key, obj);
  }
}

