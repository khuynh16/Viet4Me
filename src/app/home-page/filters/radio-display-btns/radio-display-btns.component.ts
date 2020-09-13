import { Component, OnInit } from '@angular/core';

import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-radio-display-btns',
  templateUrl: './radio-display-btns.component.html',
  styleUrls: ['./radio-display-btns.component.css']
})
export class RadioFilterBtnsComponent implements OnInit {

  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {}

  /*
  * Handling the expansion of posts.
  * @return function call to a function in filters.service.ts
  */
  changeExpand(){
    this.filterService.changeExpandEvent();
  }

  /*
  * Handling the change of language on the top of posts (rather than in the body).
  * @return function call to a function in filters.service.ts
  */
  changeLang() {
    this.filterService.changeLangEvent();
  }
}
