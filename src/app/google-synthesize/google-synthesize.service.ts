import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GoogleSynObj } from './synthesize.model';

import { environment } from '../../../src/environments/environment';

@Injectable({providedIn: 'root'})
export class GoogleSynthesizeService {

  url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key='
  key = environment.GOOGLE_APPLICATION_CREDENTIALS;

  constructor(private http: HttpClient) { }

  synthesize(obj: GoogleSynObj) {
    return this.http.post(this.url + this.key, obj);
  }
}
