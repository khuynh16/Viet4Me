import { Component, OnInit } from '@angular/core';

import { FiltersService } from '../filters.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-radio-display-btns',
  templateUrl: './radio-display-btns.component.html',
  styleUrls: ['./radio-display-btns.component.css']
})
export class RadioFilterBtnsComponent implements OnInit {

  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {

  }
  clickMe(){
    this.filterService.changeExpandEvent();
  }

  changeLang() {
    this.filterService.changeLangEvent();
  }
}
